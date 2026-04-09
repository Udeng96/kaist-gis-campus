import { useMemo } from 'react';
import { useEventStore } from '@store/eventStore';
import EventItem from './EventItem';
import noDataImg from '@assets/image/img/img_no-result-06_100x100.svg';

const EventList = () => {
    const events = useEventStore((s) => s.events);
    const filterArea = useEventStore((s) => s.filterArea);

    const filterType = useEventStore((s) => s.filterType);

    const list = useMemo(() => {
        let filtered = events?.events ?? [];
        // 구역 필터
        if (filterArea !== 'all') {
            filtered = filtered.filter((e) => e.buildingCode?.startsWith(filterArea));
        }
        // 유형 필터 (gas → gas01, gas02 매칭)
        if (filterType !== 'all') {
            filtered = filtered.filter((e) => e.type?.startsWith(filterType));
        }
        return filtered;
    }, [events, filterArea, filterType]);

    return (
        <div className="list__container">
            <div className="list list--event">
                <div className="list__head">
                    <p>유형</p>
                    <p>단계</p>
                    <p>건물명</p>
                    <p>발생 일시</p>
                    <p>종료 일시</p>
                </div>
                <div className="list__body">
                    {list.length > 0 ? (
                        <ul className="ct-scroll">
                            {list.map((event) => (
                                <EventItem key={event.id} event={event} />
                            ))}
                        </ul>
                    ) : (
                        <div className="error-frame">
                            <img src={noDataImg} alt="no data" />
                            <p>현재 조건에 해당되는 데이터가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventList;
