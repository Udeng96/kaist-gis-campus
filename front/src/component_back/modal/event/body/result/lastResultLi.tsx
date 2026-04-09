import LastResultLiDetail from "./li/lastResultLiDetail.tsx";
import LastResultLiPage from "./li/lastResultLiPage.tsx";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {EVENT_TYPE_FIRE, EVENT_TYPE_FLAME, EVENT_TYPE_GAS} from "../../../../../data_back/const/common.ts";
import moment from "moment";
import EventNoData from "../../../../body/right/body/common/event/eventNoData.tsx";
import {useShallow} from "zustand/react/shallow";
import type {EVENT_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";

const LastResultLi = () => {
    const {lastEventList, activeLastEvent, lastEventPage, setActiveLastEvent} = useLeftStore(useShallow((state)=> ({
        lastEventList : state.lastEventList,
        activeLastEvent : state.activeLastEvent,
        lastEventPage : state.lastEventPage,
        setActiveLastEvent : state.actions.setActiveLastEvent
    })));

    const setEventNm = (eventType: string) => {
        if (eventType.includes(EVENT_TYPE_GAS.cd)) {
            return EVENT_TYPE_GAS.nm
        } else if (eventType.includes(EVENT_TYPE_FIRE.cd)) {
            return EVENT_TYPE_FIRE.nm
        } else if (eventType.includes(EVENT_TYPE_FLAME.cd)) {
            return EVENT_TYPE_FLAME.nm
        }
    }

    const setEventLevel = (eventType: string) => {
        if (eventType.includes(EVENT_TYPE_GAS.cd)) {
            return Number(setType(eventType).replace("gas", "")) + "단계";
        } else if (eventType.includes(EVENT_TYPE_FIRE.cd)) {
            return "-"
        } else if (eventType.includes(EVENT_TYPE_FLAME.cd)) {
            return "-"
        }
    }

    const handleEvent = (lastEvent: EVENT_TYPE) => {
        if(activeLastEvent){
            if(activeLastEvent.seqn === lastEvent.seqn){
                setActiveLastEvent(null);
            }else{
                setActiveLastEvent(lastEvent);
            }
        }else{
            setActiveLastEvent(lastEvent)
        }
    }

    const setType = (type: string) => {
        if(type.includes("03")){
            return 'gas01';
        }else{
            return type;
        }
    }
    return (
        <div className={"hist"}>
            <div className="hist__frame">
                <div className="list list--event">
                    <div className="list__head">
                        <p>유형</p>
                        <p>단계</p>
                        <p>건물명</p>
                        <p>발생 일시</p>
                        <p>종료 일시</p>
                    </div>

                    <div className="list__body">
                        {
                            lastEventList.length > 0 &&
                            <ul>
                                {
                                    lastEventList.map((lastEvent,idx) => (
                                        idx >= (lastEventPage-1)*8 &&
                                            idx < lastEventPage* 8 &&
                                        <li key={`LAST_EVENT_${lastEvent.seqn}`} className={`list__item ${setType(lastEvent.type)} ${lastEvent.seqn === activeLastEvent?.seqn ? 'active': ''}`} onClick={()=> handleEvent(lastEvent)}>
                                            <p>{setEventNm(lastEvent.type)}</p>
                                            <p>{setEventLevel(lastEvent.type)}</p>
                                            <p>{lastEvent.mappBuildingId}</p>
                                            <p>{moment(lastEvent.outbDtm, 'YYYYMMDDHHmmss').format('YY-MM-DD HH:mm:ss')}</p>
                                            <p>{lastEvent.clrDtm ? moment(lastEvent.clrDtm, 'YYYYMMDDHHmmss').format('YY-MM-DD HH:mm:ss') : '-'}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                        {
                            lastEventList.length === 0 &&
                            <EventNoData/>
                        }
                    </div>
                </div>
                <LastResultLiPage events={lastEventList}/>
            </div>
            <LastResultLiDetail/>
        </div>
    )
}

export default LastResultLi