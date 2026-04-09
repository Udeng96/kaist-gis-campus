import { useEffect, useMemo, useState, useCallback } from 'react';
import ConfirmModal from '@components/modal/ConfirmModal';
import { useShallow } from 'zustand/react/shallow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'font-awesome/css/font-awesome.min.css';
import { postHttp, putHttp, deleteHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import { useCampusStore } from '@store/campusStore';
import { useFacStore } from '@store/facStore';
import { useCommonStore } from '@store/commonStore';
import { CCTV_TYPE_CODE } from '@constants/meta';
import { DEFAULT_CENTER } from '@constants/gis';

const CCTV_TYPES = [
    { code: '1', label: '내부', value: 'IN' },
    { code: '2', label: '외부', value: 'OUT' },
    { code: '3', label: '불꽃', value: 'FLAME' },
];

const VMS_OPTIONS = ['1', '2', '3'];

const CctvForm = () => {
    const queryClient = useQueryClient();
    const buildings = useFacStore((s) => s.buildings);
    const campusAreas = useCommonStore((s) => s.campusType);

    const { cctvFormMode, editCctv, closeCctvForm } = useCampusStore(
        useShallow((s) => ({
            cctvFormMode: s.cctvFormMode,
            editCctv: s.editCctv,
            closeCctvForm: s.actions.closeCctvForm,
        }))
    );

    const isEdit = cctvFormMode === 'EDIT';
    const isOpen = cctvFormMode !== 'NONE';

    // 폼 상태
    const [cctvType, setCctvType] = useState('1');
    const [cctvName, setCctvName] = useState('');
    const [rtspUrl, setRtspUrl] = useState('');
    const [vmsNum, setVmsNum] = useState('1');
    const [hasBuild, setHasBuild] = useState(false);
    const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selectOpen, setSelectOpen] = useState(false);
    const [appliedSearch, setAppliedSearch] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 실제 필터에 적용되는 검색어

    // 수정 모드 시 초기값 세팅
    useEffect(() => {
        if (isEdit && editCctv) {
            const typeEntry = CCTV_TYPES.find((t) => t.value === editCctv.type);
            setCctvType(typeEntry?.code ?? '1');
            setCctvName(editCctv.facInfo.facName);
            setRtspUrl(editCctv.rtspUrl ?? '');
            setVmsNum(editCctv.facInfo.facId?.substring(4, 5) ?? '1');
            if (editCctv.building) {
                setHasBuild(true);
                setSelectedBuildings(editCctv.building.split('/'));
            }
        } else if (cctvFormMode === 'CREATE') {
            resetForm();
        }
    }, [cctvFormMode, editCctv]);

    const resetForm = () => {
        setCctvType('1');
        setCctvName('');
        setRtspUrl('');
        setVmsNum('1');
        setHasBuild(false);
        setSelectedBuildings([]);
        setSearchText('');
        setAppliedSearch('');
        setExpanded([]);
    };

    const isOutdoor = cctvType === '2';
    const isFlame = cctvType === '3';

    // 트리 노드 생성
    const treeNodes = useMemo(() => {
        if (!buildings) return [];
        return campusAreas.map((area) => {
            const areaBuildings = buildings.buildingItems.filter((b) => b.area === area.code);
            const keyword = appliedSearch.replace(/\s/g, '').toLowerCase();
            const filtered = keyword
                ? areaBuildings.filter((b) =>
                    b.facInfo.facName.replace(/\s/g, '').toLowerCase().includes(keyword) ||
                    b.facInfo.facId.replace(/\s/g, '').toLowerCase().includes(keyword))
                : areaBuildings;
            return {
                value: area.code,
                label: `${area.name} (${filtered.length})`,
                children: filtered.map((b) => ({
                    value: b.facInfo.facId,
                    label: `${b.facInfo.facId} ${b.facInfo.facName}`,
                })),
            };
        });
    }, [buildings, campusAreas, appliedSearch]);

    // 유효성 검사 (외부 CCTV는 건물 선택 불필요)
    const isValid = cctvName.trim() !== '' && rtspUrl.trim() !== '' && (isOutdoor || !hasBuild || selectedBuildings.length > 0);

    // 등록 API
    const createMutation = useMutation({
        mutationFn: (data: any) => postHttp(BASE_URL + END_POINT.FAC.CCTV_CREATE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
            closeCctvForm();
        },
    });

    // 수정 API
    const updateMutation = useMutation({
        mutationFn: (data: { streamId: string; body: any }) =>
            putHttp(BASE_URL + END_POINT.FAC.CCTV_UPDATE + '/' + data.streamId, data.body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
            closeCctvForm();
        },
    });

    // 삭제 API
    const deleteMutation = useMutation({
        mutationFn: (streamId: string) => deleteHttp(BASE_URL + END_POINT.FAC.CCTV_DELETE + '/' + streamId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
            closeCctvForm();
        },
    });

    const handleSubmit = () => {
        const body = {
            cctvNm: cctvName,
            ip: '172.18.16.220',
            rtspUrl: rtspUrl,
            type: cctvType,
            xcoord: String(DEFAULT_CENTER[1]),
            ycoord: String(DEFAULT_CENTER[0]),
            building: hasBuild ? selectedBuildings.join('/') : '',
            vms: vmsNum,
        };

        if (isEdit && editCctv) {
            updateMutation.mutate({ streamId: editCctv.facInfo.facId, body });
        } else {
            createMutation.mutate(body);
        }
    };

    const handleNameChange = (v: string) => {
        if (v.length <= 15) setCctvName(v);
    };

    const handleTypeChange = (code: string) => {
        setCctvType(code);
        setSelectedBuildings([]);
        setHasBuild(false);
    };

    const removeBuilding = (code: string) => {
        setSelectedBuildings((prev) => prev.filter((b) => b !== code));
    };

    if (!isOpen) return null;

    return (
        <div className="content__frame content__frame--register cctv active">
            <div className="content__frame__head">
                <h3>{isEdit ? 'CCTV 수정' : 'CCTV 등록'}</h3>
                <button type="button" className="btn-close btn-close-02 content-close" onClick={closeCctvForm} />
            </div>

            <div className="content__frame__body">
                <div className="container">
                    {/* CCTV 유형 */}
                    <div className="frame">
                        <p className="label">CCTV 유형</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                {CCTV_TYPES.map((t) => (
                                    <button key={t.code} type="button"
                                        className={`sub-tab ${cctvType === t.code ? 'active' : ''}`}
                                        onClick={() => handleTypeChange(t.code)}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CCTV 명 */}
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label req">CCTV 명</p>
                            <p className="max"><span>{cctvName.length}</span>/15</p>
                        </div>
                        <div className="value">
                            <input type="text" placeholder="CCTV 명 입력" value={cctvName}
                                onChange={(e) => handleNameChange(e.target.value)} />
                        </div>
                    </div>

                    {/* RTSP */}
                    <div className="frame">
                        <p className="label req">RTSP</p>
                        <div className="value">
                            <input type="text" placeholder="RTSP 입력" value={rtspUrl}
                                onChange={(e) => setRtspUrl(e.target.value)} />
                        </div>
                    </div>

                    {/* VMS 관리번호 */}
                    <div className="frame">
                        <p className="label">VMS 관리번호</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                {VMS_OPTIONS.map((v) => (
                                    <button key={v} type="button"
                                        className={`sub-tab ${vmsNum === v ? 'active' : ''}`}
                                        onClick={() => setVmsNum(v)}>
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 설치 위치 (외부 CCTV는 건물 선택 불가) */}
                <div className="container" style={isOutdoor ? { opacity: 0.4, pointerEvents: 'none' } : undefined}>
                    <div className="container__head">
                        <h4>설치 위치</h4>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label">소속 건물</p>
                        </div>
                        <div className="value">
                            <div className="checkbox-wrap">
                                <label className="checkbox">
                                    <input type="radio" name="hasBuild" checked={hasBuild} onChange={() => { setHasBuild(true); setSearchText(''); setAppliedSearch(''); }} />
                                    <span className="checkmark" />
                                    <p className="name">있음</p>
                                </label>
                                <label className="checkbox">
                                    <input type="radio" name="hasBuild" checked={!hasBuild} onChange={() => setHasBuild(false)} />
                                    <span className="checkmark" />
                                    <p className="name">없음</p>
                                </label>
                            </div>
                        </div>

                        <div className="value">
                            <div className={`value search-wrap ${hasBuild ? '' : 'disabled'}`}>
                                {/* 불꽃: 커스텀 셀렉트박스 (1:1) */}
                                {isFlame ? (
                                    <div className={`select-box ${selectOpen ? 'active' : ''}`}>
                                        <button
                                            type="button"
                                            className={`btn--select ${selectedBuildings.length > 0 ? 'active' : ''}`}
                                            onClick={() => setSelectOpen(!selectOpen)}
                                        >
                                            {selectedBuildings.length > 0
                                                ? (() => {
                                                    const b = buildings?.buildingItems.find((bb) => bb.facInfo.facId === selectedBuildings[0]);
                                                    return `${selectedBuildings[0]} ${b?.facInfo.facName ?? ''}`;
                                                })()
                                                : '건물을 선택해 주세요'}
                                        </button>
                                        <div className="drop-down">
                                            <div className="active">
                                                <ul className="ct-scroll">
                                                    {buildings?.buildingItems.map((b) => (
                                                        <li
                                                            key={b.facInfo.facId}
                                                            className={`select__item ${selectedBuildings[0] === b.facInfo.facId ? 'selected' : ''}`}
                                                        >
                                                            <button type="button" onClick={() => {
                                                                setSelectedBuildings([b.facInfo.facId]);
                                                                setSelectOpen(false);
                                                            }}>
                                                                {b.facInfo.facId} {b.facInfo.facName}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* 내부: 다중선택 트리 */}
                                        <div className="token-wrap">
                                            {selectedBuildings.length === 0 && <p className="info">건물을 선택해 주세요.</p>}
                                            {selectedBuildings.length > 0 && (
                                                <ul className="token__list">
                                                    {selectedBuildings.slice(0, 2).map((code) => {
                                                        const b = buildings?.buildingItems.find((bb) => bb.facInfo.facId === code);
                                                        return (
                                                            <li key={code} className="token__item">
                                                                <p><span>{code}</span>{b?.facInfo.facName ?? ''}</p>
                                                                <button type="button" className="btn-token-delete" onClick={() => removeBuilding(code)} />
                                                            </li>
                                                        );
                                                    })}
                                                    {selectedBuildings.length > 2 && (
                                                        <li className="full__item"><p><span>+</span>{selectedBuildings.length - 2}</p></li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>

                                        <div className="search-input">
                                            <input type="search" placeholder="건물명 입력" value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') setAppliedSearch(searchText); }}
                                            />
                                            <button type="button" className="btn-search" onClick={() => setAppliedSearch(searchText)} />
                                        </div>

                                        <div className="tree-wrap">
                                            <div id="tree02" className="tui-tree-wrap ct-scroll">
                                                <CheckboxTree
                                                    nodes={treeNodes}
                                                    checked={selectedBuildings}
                                                    expanded={expanded}
                                                    onCheck={(checked) => setSelectedBuildings(checked)}
                                                    onExpand={setExpanded}
                                                />
                                            </div>
                                            {treeNodes.every((n) => n.children.length === 0) && (
                                                <p>현재 조건에 해당되는 데이터가 없습니다.</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="content__frame__footer">
                    {isEdit && (
                        <button type="button" className="btn btn-negative" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <div className="frame">
                        <button type="button" className="btn btn-normal content-close" onClick={closeCctvForm}>취소</button>
                        <button type="button" className="btn btn-primary" disabled={!isValid} onClick={handleSubmit}>
                            {isEdit ? '저장' : '등록'}
                        </button>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <ConfirmModal
                    title="CCTV 삭제"
                    message="해당 CCTV를 삭제하시겠습니까?"
                    confirmLabel="삭제"
                    confirmType="negative"
                    onConfirm={() => {
                        if (editCctv) deleteMutation.mutate(editCctv.facInfo.facId);
                        setShowDeleteConfirm(false);
                    }}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default CctvForm;
