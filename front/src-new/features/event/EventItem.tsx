import type { EventType } from '@api/types/event';
import { useEventStore } from '@store/eventStore';

interface Props {
    event: EventType;
}

const formatDateTime = (dt: string | null) => {
    if (!dt) return '-';
    const d = new Date(dt);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const getTypeClass = (type: string) => {
    if (type === 'gas02') return 'gas02';
    if (type === 'gas03') return 'gas01'; // gas03은 1단계로 표시
    if (type?.includes('gas')) return 'gas01';
    if (type === 'fire') return 'fire';
    if (type === 'flame') return 'flame';
    return type;
};

const getTypeLabel = (type: string) => {
    if (type?.includes('gas')) return '가스';
    if (type === 'fire') return '화재';
    if (type === 'flame') return '불꽃';
    return type;
};

const getLevel = (event: EventType) => {
    if (event.type === 'gas01') return '1단계';
    if (event.type === 'gas02') return '2단계';
    if (event.type === 'gas03') return '1단계';
    return '-';
};

const EventItem = ({ event }: Props) => {
    const activeEvent = useEventStore((s) => s.activeEvent);
    const setActiveEvent = useEventStore((s) => s.actions.setActiveEvent);

    const isActive = activeEvent?.id === event.id;
    const typeClass = getTypeClass(event.type);

    const handleClick = () => {
        setActiveEvent(isActive ? null : event);
    };

    return (
        <li className={`list__item ${typeClass} ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <p>{getTypeLabel(event.type)}</p>
            <p>{getLevel(event)}</p>
            <p>{event.buildingCode ?? '-'}</p>
            <p>{formatDateTime(event.occurredAt)}</p>
            <p>{formatDateTime(event.clearedAt)}</p>
        </li>
    );
};

export default EventItem;
