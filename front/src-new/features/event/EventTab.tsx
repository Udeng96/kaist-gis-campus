import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { EventResponse } from '@api/types/event';
import { useEventStore } from '@store/eventStore';
import EventSummary from './EventSummary';
import EventFilter from './EventFilter';
import EventList from './EventList';

const EventTab = () => {
    const filterArea = useEventStore((s) => s.filterArea);
    const filterType = useEventStore((s) => s.filterType);
    const setEvents = useEventStore((s) => s.actions.setEvents);

    const { data } = useQuery({
        queryKey: ['events'],
        queryFn: () => getHttp<EventResponse>(BASE_URL + END_POINT.EVENT.ALL, {}),
        refetchInterval: 10000,
    });

    useEffect(() => {
        if (data) setEvents(data);
    }, [data]);

    return (
        <li className="tab__item tab__item--event active">
            <EventSummary />
            <hr className="divider" />
            <EventFilter />
            <EventList />
        </li>
    );
};

export default EventTab;
