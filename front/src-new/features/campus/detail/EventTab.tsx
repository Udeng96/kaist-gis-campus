import { useEffect, useState } from 'react';
import { useCampusStore } from '@store/campusStore';
import { useCommonStore } from '@store/commonStore';
import { useEventStore } from '@store/eventStore';
import type { EventType } from '@api/types/event';
import EventTabSearch from './EventTabSearch';
import EventTabResult from './EventTabResult';

const EventTab = () => {
    const campusBuildingEvents = useEventStore((s) => s.campusBuildingEvents);
    const eventTypes = useCommonStore((s) => s.eventType);
    const rightTab = useCampusStore((s) => s.rightTab);
    const [activeType, setActiveType] = useState('whole');
    const [filterEvents, setFilterEvents] = useState<EventType[]>([]);

    useEffect(() => {
        setFilterEvents(campusBuildingEvents?.events ?? []);
    }, [campusBuildingEvents]);

    return (
        <li className={`tab__item tab__item--event ${rightTab === 'EVENT' ? 'active' : ''}`}>
            <div className="content__sub-head">
                <h2 className="content__sub-title">이벤트 발생 현황</h2>
                <button type="button" className="btn btn-normal btn-excel">엑셀 다운</button>
            </div>
            <EventTabSearch />
            <div className="preset-wrap">
                <button type="button" className={`btn-preset all ${activeType === 'whole' ? 'active' : ''}`} onClick={() => setActiveType('whole')}>
                    <p className="name all">전체</p>
                    <p className="value">0</p>
                </button>
                {eventTypes.map((type) => (
                    <button key={type.code} type="button" className={`btn-preset ${type.code === activeType ? 'active' : ''}`} onClick={() => setActiveType(type.code)}>
                        <p className={`name ${type.code} event`}>{type.name.replace('이벤트', '')}</p>
                        <p className="value">0</p>
                    </button>
                ))}
            </div>
            <EventTabResult events={filterEvents} />
        </li>
    );
};

export default EventTab;
