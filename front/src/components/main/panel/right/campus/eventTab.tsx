import {useCampusStore} from "../../../../../data/campus.ts";
import EventTabSearch from "./eventTabSearch.tsx";
import {useEffect, useState} from "react";
import {useCommonStore} from "../../../../../api/data/common.ts";
import EventTabResult from "./eventTabResult.tsx";
import {useEventStore} from "../../../../../api/data/event.ts";
import type {EventType} from "../../../../../api/types/eventTypes.ts";

const EventTab = () => {

    const campusBuildingEvents = useEventStore().campusBuildingEvents;
    const eventTypes = useCommonStore().eventType;
    const rightTab = useCampusStore().rightTab;
    const [activeType, setActiceType] = useState<string>('whole');
    const [filterEvents, setFilterEvents]= useState<EventType[]>([]);

    useEffect(() => {
        if(campusBuildingEvents){
            setFilterEvents(campusBuildingEvents.events);
        }else{
            setFilterEvents([]);
        }
    }, [campusBuildingEvents]);

    return(
        <li className={`tab__item tab__item--event ${rightTab === 'EVENT' ? 'active' :''}`}>
            <div className="content__sub-head">
                <h2 className="content__sub-title">이벤트 발생 현황</h2>
                <button type="button" className="btn btn-normal btn-excel">엑셀 다운</button>
            </div>
            <EventTabSearch/>
            <div className="preset-wrap">
                <button type="button" className={`btn-preset all ${activeType === 'whole' ? 'active' :''}`}  onClick={()=>setActiceType('whole')}>
                    <p className={`name all`}>전체</p>
                    <p className="value">0</p>
                </button>
                {
                    eventTypes.map((type)=>(
                        <button type="button" className={`btn-preset ${type.code === activeType ? 'active' : ''}`} onClick={()=>setActiceType(type.code)}>
                            <p className={`name ${type.code} event`}>{type.name.replace("이벤트","")}</p>
                            <p className="value">0</p>
                        </button>
                    ))
                }
            </div>
            <EventTabResult events={filterEvents}/>
        </li>
    )

}

export default EventTab