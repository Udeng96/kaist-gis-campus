import type {EVENT_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {
    EVENT_TYPE_FIRE,
    EVENT_TYPE_FLAME,
    EVENT_TYPE_GAS,
    EVENT_TYPE_WHOLE
} from "../../../../../../data_back/const/common.ts";
import moment from "moment";
import EventNoData from "./eventNoData.tsx";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";

const EventLiResult = (props:{eventList:EVENT_TYPE[]}) => {

    const activeEventType = useRightStore((state)=> state.activeEventType);
    const setEventNm =  (eventType:string) => {
        if(eventType.includes("gas")){
            return EVENT_TYPE_GAS.nm;
        }else if(eventType.includes("flame")){
            return EVENT_TYPE_FLAME.nm
        }else{
            return EVENT_TYPE_FIRE.nm
        }
    }

    const setEventLevel = (eventType:string) => {
        if(eventType.includes("gas")){
            if(eventType.split("ㄷ0")[1] === '3'){
                return '1단계';
            }else{
                return eventType.split("0")[1]+'단계';
            }
        }else{
            return '-';
        }
    }

    return(
        <div className="list__container ">
            <div className="list list--event">
                <div className="list__head">
                    <p>유형</p>
                    <p>단계</p>
                    <p>발생 일시</p>
                    <p>종료 일시</p>
                </div>

                <div className="list__body">
                    {
                        props.eventList.length === 0&&
                        <EventNoData/>
                    }
                    {
                        props.eventList.length > 0 &&
                        <ul className="ct-scroll">
                            {
                                props.eventList.filter((item)=> activeEventType.cd !== EVENT_TYPE_WHOLE.cd ? item.type.includes(activeEventType.cd) : true).map((item)=>(
                                    <li className="list__item gas01">
                                        <p>{setEventNm(item.type)}</p>
                                        <p>{setEventLevel(item.type)}</p>
                                        <p>{moment(item.outbDtm,'YYYYMMDDHHmmss').format('YY-MM-DD HH:mm:ss')}</p>
                                        <p>{(item.clrDtm!==null && item.clrDtm !== "") ? moment(item.clrDtm,'YYYYMMDDHHmmss').format('YY-MM-DD HH:mm:ss') : '-'}</p>
                                    </li>
                                ))
                            }
                        </ul>
                    }
                </div>
            </div>
        </div>
    )

}

export default EventLiResult