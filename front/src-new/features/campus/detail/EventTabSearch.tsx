import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { EventResponse } from '@api/types/event';
import { useCampusStore } from '@store/campusStore';
import { useEventStore } from '@store/eventStore';
import CalenderIcon from '@assets/image/ic/ic_calendar_default_line_normal_white_28.svg';

const EventTabSearch = () => {
    const setCampusBuildingEvents = useEventStore((s) => s.actions.setCampusBuildingEvents);
    const { activeBuilding, rightTab } = useCampusStore(useShallow((s) => ({
        activeBuilding: s.activeBuilding,
        rightTab: s.rightTab,
    })));

    const [startDtm, setStartDtm] = useState(moment().format('YYYYMMDD'));
    const [endDtm, setEndDtm] = useState(moment().format('YYYYMMDD'));
    const [requestState, setRequestState] = useState('success');

    useEffect(() => {
        if (activeBuilding && rightTab === 'EVENT') setRequestState('request');
    }, [activeBuilding, rightTab]);

    const { data: buildingEvents } = useQuery({
        queryKey: ['event-building'],
        queryFn: () => getHttp<EventResponse>(BASE_URL + END_POINT.EVENT.BUILDING, {
            startDtm, endDtm, building: activeBuilding?.facInfo.facId,
        }),
        enabled: requestState === 'request',
    });

    useEffect(() => {
        if (buildingEvents) setCampusBuildingEvents(buildingEvents);
        setRequestState('success');
    }, [buildingEvents]);

    return (
        <div className="content__sub-head">
            <p className="mark">기간 설정</p>
            <div className="datepicker__wrap datepicker__wrap--Range">
                <DatePicker icon={<img src={CalenderIcon} />} showIcon selected={moment(startDtm, 'YYYYMMDD').toDate()} dateFormat="YYYY-MM-DD" onChange={(e: Date | null) => setStartDtm(moment(e).format('YYYYMMDD'))} />
                <span className="term">~</span>
                <DatePicker icon={<img src={CalenderIcon} />} showIcon selected={moment(endDtm, 'YYYYMMDD').toDate()} dateFormat="YYYY-MM-DD" onChange={(e: Date | null) => setEndDtm(moment(e).format('YYYYMMDD'))} />
            </div>
            <button type="button" className="btn btn-primary mini" onClick={() => setRequestState('request')}>검색</button>
        </div>
    );
};

export default EventTabSearch;
