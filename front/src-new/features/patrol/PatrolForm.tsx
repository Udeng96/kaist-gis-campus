import { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePatrolStore } from '@store/patrolStore';
import { postHttp, putHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import ConfirmModal from '../../components/modal/ConfirmModal';
import PatrolCctvTree from './PatrolCctvTree';
import PatrolCctvItem from './PatrolCctvItem';
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import NO_RESULT from '../../assets/image/img/img_no-result-06_100x100.svg';

type Props = {
    onSaved: () => void;
};

const AREA_LIST = ['N', 'W', 'E'];

const PatrolForm = ({ onSaved }: Props) => {
    const editingPatrol = usePatrolStore((s) => s.editingPatrol);
    const editName = usePatrolStore((s) => s.editName);
    const editCctvs = usePatrolStore((s) => s.editCctvs);
    const setEditName = usePatrolStore((s) => s.actions.setEditName);
    const removeEditCctv = usePatrolStore((s) => s.actions.removeEditCctv);
    const closeEditForm = usePatrolStore((s) => s.actions.closeEditForm);

    const [activeArea, setActiveArea] = useState('N');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isEdit = editingPatrol !== null;
    const isDisabled = !editName.trim() || editCctvs.length < 3;

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = editCctvs.findIndex(
            (c) => `${c.cctvInfo.building}_${c.cctvInfo.facInfo.facId}` === active.id
        );
        const newIndex = editCctvs.findIndex(
            (c) => `${c.cctvInfo.building}_${c.cctvInfo.facInfo.facId}` === over.id
        );

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(editCctvs, oldIndex, newIndex).map((c, i) => ({ ...c, order: i }));

        // store 갱신
        const store = usePatrolStore.getState();
        for (let i = store.editCctvs.length - 1; i >= 0; i--) {
            store.actions.removeEditCctv(i);
        }
        reordered.forEach((c) => store.actions.addEditCctv(c));
    };

    const handlePatrolNm = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 12) {
            setEditName(e.target.value);
        }
    };

    const handleClearAll = () => {
        const store = usePatrolStore.getState();
        for (let i = store.editCctvs.length - 1; i >= 0; i--) {
            store.actions.removeEditCctv(i);
        }
    };

    const handleSave = async () => {
        if (isDisabled) return;

        const streamIds = editCctvs.map((c) => c.cctvInfo.facInfo.facId);

        const body = { name: editName, streamIds };

        if (isEdit) {
            await putHttp(`${BASE_URL}${END_POINT.PATROL.UPDATE}/${editingPatrol!.id}`, body);
        } else {
            await postHttp(BASE_URL + END_POINT.PATROL.CREATE, body);
        }

        closeEditForm();
        onSaved();
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!isEdit || !editingPatrol) return;
        const { deleteHttp } = await import('@api/http');
        await deleteHttp(`${BASE_URL}${END_POINT.PATROL.DELETE}/${editingPatrol.id}`);
        setShowDeleteConfirm(false);
        closeEditForm();
        onSaved();
    };

    return (
        <>
        <div className="patrol-regi">
            <div className="content__frame active">
                {/* 헤더 */}
                <div className="content__frame__head">
                    <h3>순찰 그룹 {isEdit ? '편집' : '등록'}</h3>
                    <button type="button" className="btn-close btn-close-02 content-close" onClick={closeEditForm} />
                </div>

                {/* 바디 */}
                <div className="content__frame__body">
                    {/* 그룹명 */}
                    <div className="container">
                        <div className="frame">
                            <div className="frame__head">
                                <p className="label req">그룹명</p>
                                <p className="max"><span>{editName.length}</span>/12</p>
                            </div>
                            <div className="value">
                                <input
                                    type="text"
                                    placeholder="그룹명 입력"
                                    style={{ padding: '8px 14px' }}
                                    value={editName}
                                    onChange={handlePatrolNm}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CCTV 트리 */}
                    <div className="container">
                        <div className="frame">
                            <p className="label">CCTV 리스트</p>
                            <div className="value">
                                <div className="sub-tab__wrap-2">
                                    {AREA_LIST.map((area) => (
                                        <button
                                            key={area}
                                            type="button"
                                            className={`sub-tab ${area === activeArea ? 'active' : ''}`}
                                            onClick={() => setActiveArea(area)}
                                        >
                                            {area}구역
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="value">
                                <div className="tree-wrap">
                                    <div id="tree" className="tui-tree-wrap ct-scroll">
                                        <PatrolCctvTree activeArea={activeArea} />
                                    </div>
                                </div>
                            </div>
                            <div className="value">
                                <p className="info">CCTV는 최소 3개 이상 선택해야 합니다.</p>
                            </div>
                        </div>
                    </div>

                    {/* 선택된 CCTV (DnD) */}
                    <div className="list__container">
                        <div className="container__head">
                            <h4><span>{editCctvs.length}대</span> 선택</h4>
                            <button
                                type="button"
                                className="btn-text"
                                disabled={editCctvs.length === 0}
                                onClick={handleClearAll}
                            >
                                전체 삭제
                            </button>
                        </div>

                        {editCctvs.length > 0 ? (
                            <div className="list list--patrol">
                                <div className="list__head">
                                    <p>NO</p>
                                    <p>구역</p>
                                    <p>건물명</p>
                                    <p>유형</p>
                                    <p>CCTV명</p>
                                </div>
                                <div className="list__body">
                                    <ul className="ct-scroll">
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <SortableContext
                                                items={editCctvs.map(
                                                    (c) => `${c.cctvInfo.building}_${c.cctvInfo.facInfo.facId}`
                                                )}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {editCctvs.map((c, i) => (
                                                    <PatrolCctvItem
                                                        key={`${c.cctvInfo.building}_${c.cctvInfo.facInfo.facId}`}
                                                        cctv={c}
                                                        idx={i}
                                                        onRemove={() => removeEditCctv(i)}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </DndContext>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="list__body">
                                <ul className="ct-scroll">
                                    <div className="error-frame">
                                        <img src={NO_RESULT} alt="" />
                                        <p>CCTV를 선택해주세요.</p>
                                    </div>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* 푸터 */}
                <div className="content__frame__footer">
                    {isEdit && (
                        <button type="button" className="btn btn-negative" onClick={handleDeleteClick}>삭제</button>
                    )}
                    <div className="frame">
                        <button type="button" className="btn btn-normal content-close" onClick={closeEditForm}>취소</button>
                        <button type="button" className="btn btn-primary" disabled={isDisabled} onClick={handleSave}>
                            {isEdit ? '저장' : '등록'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {showDeleteConfirm && createPortal(
            <ConfirmModal
                title="순찰 그룹 삭제"
                titleHighlight="삭제"
                message="순찰 그룹을 삭제하시겠습니까?"
                confirmLabel="삭제"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />,
            document.body
        )}
        </>
    );
};

export default PatrolForm;
