import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import { useEventStore } from '@store/eventStore';
import { useFacStore } from '@store/facStore';
import ConfirmModal from '@components/modal/ConfirmModal';

const CCTV_FILTER = [
    { code: 'all', label: '전체' },
    { code: 'IN', label: '내부' },
    { code: 'OUT', label: '외부' },
    { code: 'FLAME', label: '불꽃' },
];

const PAGE_SIZE = 8;

const EventRight = () => {
    const queryClient = useQueryClient();
    const activeEvent = useEventStore((s) => s.activeEvent);
    const setActiveEvent = useEventStore((s) => s.actions.setActiveEvent);
    const isCastMode = useEventStore((s) => s.isCastMode);
    const castCctvs = useEventStore((s) => s.castCctvs);
    const toggleCastMode = useEventStore((s) => s.actions.toggleCastMode);
    const cctvs = useFacStore((s) => s.cctvs);
    const [activeType, setActiveType] = useState('all');
    const [page, setPage] = useState(1);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const clearMutation = useMutation({
        mutationFn: (id: number) => putHttp(BASE_URL + END_POINT.EVENT.CLEAR + '/' + id, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            setActiveEvent(null);
        },
    });

    const buildingCctvs = useMemo(() => {
        if (!activeEvent?.buildingCode || !cctvs) return [];
        return cctvs.cctvItems.filter((c) => c.building?.includes(activeEvent.buildingCode!));
    }, [activeEvent, cctvs]);

    // 건물 CCTV + 수동 투망 CCTV 합산 (중복 제거)
    const allCctvs = useMemo(() => {
        const ids = new Set(buildingCctvs.map((c) => c.facInfo.facId));
        const extra = castCctvs.filter((c) => !ids.has(c.facInfo.facId));
        return [...buildingCctvs, ...extra];
    }, [buildingCctvs, castCctvs]);

    const filtered = useMemo(() => {
        if (activeType === 'all') return allCctvs;
        return allCctvs.filter((c) => c.type === activeType);
    }, [allCctvs, activeType]);

    const pageList = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    if (!activeEvent) return null;

    return (
        <div className="content__frame content__frame--details event active">
            <div className="content__head">
                <h2 className="content__title content__title--cctv">{activeEvent.buildingCode} 주변 CCTV</h2>
                <div className="frame">
                    <button type="button" className="btn-refresh">새로고침<i /></button>
                    <button type="button" className="btn btn-negative"
                        disabled={activeEvent.clearedAt !== null}
                        onClick={() => setShowClearConfirm(true)}
                    >이벤트 종료</button>
                </div>
            </div>
            <div className="content__body">
                <div className="content__sub-head">
                    <h2 className="content__sub-title">실시간 CCTV<span>{allCctvs.length}</span>대</h2>
                    <button type="button" className={`btn btn-normal btn-ic plus ${isCastMode ? 'active' : ''}`} onClick={toggleCastMode}>수동 투망<i /></button>
                </div>

                {/* CCTV 유형 카운트 */}
                <div className="preset-wrap">
                    {CCTV_FILTER.map((f) => {
                        const cnt = f.code === 'all' ? allCctvs.length : allCctvs.filter((c) => c.type === f.code).length;
                        return (
                            <button key={f.code} type="button"
                                className={`btn-preset ${f.code === 'all' ? 'all' : ''} ${activeType === f.code ? 'active' : ''}`}
                                onClick={() => { setActiveType(f.code); setPage(1); }}
                            >
                                <p className={`name ${f.code.toLowerCase()}`}>{f.label}</p>
                                <p className="value">{cnt}</p>
                            </button>
                        );
                    })}
                </div>

                {/* CCTV 플레이어 격자 */}
                <div className="cctv__list ct-scroll">
                    <ul>
                        {pageList.map((cctv, idx) => {
                            const typeClass = cctv.type === 'IN' ? 'in' : cctv.type === 'OUT' ? 'out' : 'flame';
                            const num = (page - 1) * PAGE_SIZE + idx + 1;
                            return (
                                <li key={cctv.facInfo.facId} className={`cctv__item cctv__item--${typeClass}`}>
                                    <div className="cctv__head">
                                        <div className="num">{num}</div>
                                        <p>{cctv.facInfo.facName}</p>
                                    </div>
                                    <div className="cctv__body">
                                        <div className="cctv__in" style={{ background: '#1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, color: 'var(--neutral-4)', fontSize: 12 }}>
                                            CCTV 영상 영역
                                        </div>
                                        <button type="button" className="btn-expand" />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* 페이징 */}
                {filtered.length > PAGE_SIZE && (
                    <div className="paging">
                        <div className="btn-wrap">
                            <button type="button" className="btn__paging btn__paging--prev" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M13 16L9 12L13 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="num">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <a key={p} href="#" className={`btn__paging btn__num ${page === p ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</a>
                            ))}
                        </div>
                        <div className="btn-wrap">
                            <button type="button" className="btn__paging btn__paging--next" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 8L15 12L11 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showClearConfirm && (
                <ConfirmModal
                    title="이벤트 종료"
                    message="해당 이벤트를 종료하시겠습니까?"
                    confirmLabel="종료"
                    confirmType="negative"
                    onConfirm={() => {
                        if (activeEvent) clearMutation.mutate(activeEvent.id);
                        setShowClearConfirm(false);
                    }}
                    onCancel={() => setShowClearConfirm(false)}
                />
            )}
        </div>
    );
};

export default EventRight;
