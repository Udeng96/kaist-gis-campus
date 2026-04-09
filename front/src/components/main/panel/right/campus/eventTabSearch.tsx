import {useQuery} from "@tanstack/react-query";
import {getHttp} from "../../../../../api/commonApi.ts";
import type {EventResponse} from "../../../../../api/types/eventTypes.ts";
import {BASE_URL, END_POINT} from "../../../../../config/url.ts";
import {useCampusStore} from "../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import CalenderIcon from "../../../../../assets/image/ic/ic_calendar_default_line_normal_white_28.svg"
import {useEventStore} from "../../../../../api/data/event.ts";

const EventTabSearch = () => {

    const setCampusBuildingEvents = useEventStore().actions.setCampusBuildingEvents;
    const {activeBuilding, rightTab} = useCampusStore(useShallow((state)=> ({
        activeBuilding : state.activeBuilding,
        rightTab : state.rightTab
    })));

    const [startDtm, setStartDtm] = useState<string>(moment().format('YYYYMMDD'));
    const [endDtm, setEndDtm] = useState<string>(moment().format('YYYYMMDD'));
    const [requestState, setRequestState] = useState<string>('success');

    useEffect(() => {
        if(activeBuilding !== null && rightTab === 'EVENT'){
            setRequestState('request');
        }
    }, [activeBuilding,rightTab]);

    const {data: buildingEvents} = useQuery({
        queryKey: ["event-building"],
        queryFn: () => getHttp<EventResponse>(BASE_URL + END_POINT.EVENT.BUILDING, {
            startDtm: startDtm,
            endDtm: endDtm,
            building: activeBuilding?.facInfo.facId
        }),
        enabled: requestState === 'request'
    })

    useEffect(() => {
        if(buildingEvents){
            setCampusBuildingEvents(buildingEvents);
        }
        setRequestState('success');
    }, [buildingEvents]);

    return (
        <div className="content__sub-head">
            <p className="mark">기간 설정</p>
            <div className="datepicker__wrap datepicker__wrap--Range">
                <DatePicker icon={<img src={CalenderIcon}/>} showIcon={true} selected={moment(startDtm, 'YYYYMMDD').toDate()} dateFormat={'YYYY-MM-DD'} onChange={(e:Date|null)=> setStartDtm(moment(e).format('YYYYMMDD'))}/>

                <span className="term">~</span>
                <DatePicker icon={<img src={CalenderIcon}/>} showIcon={true}  selected={moment(endDtm, 'YYYYMMDD').toDate()} dateFormat={'YYYY-MM-DD'} onChange={(e:Date|null)=> setEndDtm(moment(e).format('YYYYMMDD'))}/>

            </div>
            <button type="button" className="btn btn-primary mini" onClick={()=> setRequestState('request')}>검색</button>

        </div>
    )

}

export default EventTabSearch