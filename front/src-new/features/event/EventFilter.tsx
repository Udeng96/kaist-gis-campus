import { useState } from 'react';
import { useEventStore } from '@store/eventStore';
import { useCommonStore } from '@store/commonStore';
import LastEventModal from './modal/LastEventModal';

const EVENT_TYPE_OPTIONS = [
    { code: 'all', name: '전체' },
    { code: 'gas', name: '가스' },
    { code: 'fire', name: '화재' },
    { code: 'flame', name: '불꽃' },
];

const EventFilter = () => {
    const campusAreas = useCommonStore((s) => s.campusType);
    const tempArea = useEventStore((s) => s.tempArea);
    const tempType = useEventStore((s) => s.tempType);
    const setTempArea = useEventStore((s) => s.actions.setTempArea);
    const setTempType = useEventStore((s) => s.actions.setTempType);
    const applyFilter = useEventStore((s) => s.actions.applyFilter);
    const resetFilter = useEventStore((s) => s.actions.resetFilter);
    const events = useEventStore((s) => s.events);
    const [isDrop, setIsDrop] = useState(false);
    const [showLastEvent, setShowLastEvent] = useState(false);

    return (
        <>
            <div className="content__sub-head">
                <h2 className="content__sub-title">이벤트 현황</h2>
                <button type="button" className="btn btn-normal" onClick={() => setShowLastEvent(true)}>지난 이벤트 내역</button>
            </div>
            <div className="filter">
                <div className="filter__frame">
                    <p className="mark label">캠퍼스 구역</p>
                    <div className="value">
                        <div className="sub-tab__wrap-2">
                            <button
                                type="button"
                                className={`sub-tab ${tempArea === 'all' ? 'active' : ''}`}
                                onClick={() => setTempArea('all')}
                            >전체</button>
                            {campusAreas.map((area) => (
                                <button
                                    key={area.code}
                                    type="button"
                                    className={`sub-tab ${tempArea === area.code ? 'active' : ''}`}
                                    onClick={() => setTempArea(area.code)}
                                >{area.name}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="filter__frame">
                    <p className="mark label">이벤트 유형</p>
                    <div className="value">
                        <div className={`select-box ${isDrop ? 'active' : ''}`}>
                            <button className="btn--select" onClick={() => setIsDrop(!isDrop)}>
                                {EVENT_TYPE_OPTIONS.find((t) => t.code === tempType)?.name ?? '전체'}
                            </button>
                            <div className="drop-down">
                                <ul className="ct-scroll">
                                    {EVENT_TYPE_OPTIONS.map((item) => (
                                        <li key={item.code} className={`select__item ${tempType === item.code ? 'selected' : ''}`}>
                                            <button onClick={() => { setTempType(item.code); setIsDrop(false); }}>{item.name}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="filter__footer">
                    <button type="button" className="btn btn-normal btn-reset" onClick={resetFilter}>초기화</button>
                    <button type="button" className="btn btn-primary btn-check" onClick={applyFilter}>조회</button>
                </div>
            </div>
            <div className="result">
                <p>조회 결과<span>{events?.totalCnt ?? 0}</span>건</p>
                <button type="button" className="btn-add" onClick={() => useEventStore.getState().actions.setPassiveFormOpen(true)}>수동 이벤트 등록</button>
            </div>
            {showLastEvent && <LastEventModal onClose={() => setShowLastEvent(false)} />}
        </>
    );
};

export default EventFilter;
