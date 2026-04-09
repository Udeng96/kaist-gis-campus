import { useEventStore } from '@store/eventStore';

const EventSummary = () => {
    const events = useEventStore((s) => s.events);
    const list = events?.events ?? [];

    const gasCount = list.filter((e) => e.type?.includes('gas')).length;
    const flameCount = list.filter((e) => e.type === 'flame').length;
    const fireCount = list.filter((e) => e.type === 'fire').length;

    return (
        <div className="event__frame">
            <h2 className="content__sub-title">오늘의 이벤트 요약</h2>
            <ul>
                <li className="event__item">
                    <p className="name gas">가스</p>
                    <p className="value">{gasCount}</p>
                </li>
                <li className="event__item">
                    <p className="name flame">불꽃</p>
                    <p className="value">{flameCount}</p>
                </li>
                <li className="event__item">
                    <p className="name fire">화재</p>
                    <p className="value">{fireCount}</p>
                </li>
            </ul>
        </div>
    );
};

export default EventSummary;
