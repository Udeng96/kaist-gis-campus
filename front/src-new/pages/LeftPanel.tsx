import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { FacResponse } from '@api/types/fac';
import { useFacStore } from '@store/facStore';
import { useCommonClientStore } from '@store/appStore';
import { useCommonStore } from '@store/commonStore';
import Campus from '@features/campus/Campus';
import EventTab from '@features/event/EventTab';
import FavoriteTab from '@features/favorite/FavoriteTab';
import PatrolTab from '@features/patrol/PatrolTab';
import { usePatrolStore } from '@store/patrolStore';

const LeftPanel = () => {
    const [isOpen, setIsOpen] = useState(true);
    const isPatrolMode = usePatrolStore((s) => s.isPatrolMode);
    const isPatrolEditing = usePatrolStore((s) => s.isEditing);
    const openEditForm = usePatrolStore((s) => s.actions.openEditForm);
    const activeLeftMenu = useCommonClientStore((s) => s.activeLeftMenu);
    const { setActiveAlarm, setActiveLeftMenu } = useCommonClientStore(useShallow((s) => s.actions));
    const activeAlarm = useCommonClientStore((s) => s.activeAlarm);
    const leftTabTypes = useCommonStore((s) => s.leftTab);
    const { setCctvs, setBuildings } = useFacStore(useShallow((s) => s.actions));

    const { data: facilities } = useQuery({
        queryKey: ['facilities'],
        queryFn: () => getHttp<FacResponse>(BASE_URL + END_POINT.FAC.ALL, {}),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (facilities) {
            setCctvs(facilities.cctv);
            setBuildings(facilities.building);
        }
    }, [facilities]);

    return (
        <section className={`content content--left ${isOpen ? 'active' : ''}`}>
            <div className="dimmed" />
            <button type="button" className="btn-slide btn-slide--left" onClick={() => setIsOpen(!isOpen)} />
            <div className="tab active">
                {/* Head */}
                {!(isPatrolMode && isPatrolEditing) && (
                <div className="content__head">
                    {isPatrolMode ? (
                        /* 순찰 모드 헤더 */
                        <div className="patrol__head">
                            <h2 className="content__title">순찰 모드</h2>
                            <button
                                type="button"
                                className="btn btn-normal btn-ic plus patrol-group"
                                onClick={() => openEditForm(null)}
                            >
                                순찰 그룹 등록
                            </button>
                        </div>
                    ) : (
                        /* 일반 모드 헤더 */
                        <>
                            <div className="frame">
                                <h2 className="content__title">GIS 대시보드</h2>
                                <button type="button" className="toggle">
                                    <input type="checkbox" className="toggle__checkbox" checked={activeAlarm} onChange={() => setActiveAlarm(!activeAlarm)} />
                                    <div className="toggle__circle" />
                                    <span className="toggle__text" />
                                    <div className="toggle__layer" />
                                </button>
                            </div>
                            <div className="btn-tab__wrap">
                                {leftTabTypes.map((tab) => (
                                    <button
                                        key={`left_tab_${tab.code}`}
                                        type="button"
                                        className={`btn-tab ${activeLeftMenu === tab.code ? 'active' : ''}`}
                                        onClick={() => setActiveLeftMenu(tab.code)}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                )}
                {/* Body */}
                <div className="content__body">
                    {isPatrolMode ? (
                        <PatrolTab />
                    ) : (
                        <ul>
                            {activeLeftMenu === 'CAMPUS' && <Campus />}
                            {activeLeftMenu === 'EVENT' && <EventTab />}
                            {activeLeftMenu === 'FAVORITE' && <FavoriteTab />}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LeftPanel;
