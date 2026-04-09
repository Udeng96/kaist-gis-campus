import { useState } from 'react';
import type { PatrolType, PatrolCctvType } from '@api/types/patrol';
import { usePatrolStore } from '@store/patrolStore';
import { deleteHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';

type Props = {
    patrols: PatrolType[];
    onRefresh: () => void;
};

const CCTV_TYPE_MAP: Record<string, { class: string; label: string }> = {
    IN: { class: 'in', label: '내부' },
    OUT: { class: 'out', label: '외부' },
    FLAME: { class: 'flame', label: '불꽃' },
};

const PatrolList = ({ patrols, onRefresh }: Props) => {
    const { playPatrol, stopPatrol, openEditForm } = usePatrolStore((s) => s.actions);
    const activePatrol = usePatrolStore((s) => s.activePatrol);
    const [openIds, setOpenIds] = useState<number[]>([]);

    const toggleOpen = (id: number) => {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('순찰 그룹을 삭제하시겠습니까?')) return;
        await deleteHttp(`${BASE_URL}${END_POINT.PATROL.DELETE}/${id}`);
        onRefresh();
    };

    const handlePlay = (e: React.MouseEvent, patrol: PatrolType) => {
        e.stopPropagation();
        if (activePatrol?.id === patrol.id) {
            stopPatrol();
        } else {
            playPatrol(patrol);
        }
    };

    const handleEdit = (e: React.MouseEvent, patrol: PatrolType) => {
        e.stopPropagation();
        openEditForm(patrol);
    };

    if (patrols.length === 0) {
        return (
            <div className="error-frame">
                <div className="error-frame__icon">
                    <img src="/kaist/gis/src-new/assets/image/ic/ic_folder_line_normal_gray_48.svg" alt="" />
                </div>
                <p className="error-frame__txt">등록된 순찰 그룹이 없습니다.</p>
            </div>
        );
    }

    return (
        <ul className="ct-scroll">
            {patrols.map((patrol) => {
                const isOpen = openIds.includes(patrol.id);
                const isActive = activePatrol?.id === patrol.id;
                const cctvs = patrol.cctvMapps ?? [];

                return (
                    <li key={patrol.id} className="patrol__item" onClick={() => toggleOpen(patrol.id)}>
                        <div className={`patrol__item__head ${isOpen ? 'active' : ''}`}>
                            <p>{patrol.name}</p>
                            <button
                                type="button"
                                className={`btn-play ${isActive ? 'active' : ''}`}
                                onClick={(e) => handlePlay(e, patrol)}
                                disabled={cctvs.length === 0}
                            />
                        </div>
                        <div className="patrol__item__body">
                            {cctvs.map((cctv: PatrolCctvType, idx: number) => {
                                const typeInfo = CCTV_TYPE_MAP[cctv.cctvInfo?.type ?? ''] ?? CCTV_TYPE_MAP.IN;
                                const building = cctv.cctvInfo?.building ?? '';
                                const area = building ? building.substring(0, 1) + '구역' : '';
                                return (
                                    <div key={idx} className={`patrol__item__box patrol__item__box--${typeInfo.class}`}>
                                        <i>{idx + 1}</i>
                                        <div className="frame">
                                            <p>{area}</p>
                                            <p>{building}</p>
                                            <p>{typeInfo.label}</p>
                                            <p>{cctv.cctvInfo?.facInfo?.facName ?? ''}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <button
                                type="button"
                                className="btn btn-normal btn-ic pen"
                                onClick={(e) => handleEdit(e, patrol)}
                            >
                                편집
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default PatrolList;
