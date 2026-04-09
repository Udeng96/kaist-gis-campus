import moment from "moment/moment";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {EVENT_TYPE_FIRE, EVENT_TYPE_FLAME, EVENT_TYPE_GAS} from "../../../../../../../data_back/const/common.ts";
import {useEffect, useState} from "react";
import type {EVENT_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";

const EventLiItem = (props:{event : EVENT_TYPE,eventId:string, type: string, level: string, building: string, outbDtm: string, endDtm: string}) => {

    const {cctvList, activeEvent, setActiveEvent, setActiveEventCctvs, activeEventCctvs} = useLeftStore(useShallow((state)=> ({
        cctvList : state.cctvList,
        activeEvent : state.activeEvent,
        setActiveEvent : state.actions.setActiveEvent,
        setActiveEventCctvs : state.actions.setActiveEventCctvs,
        activeEventCctvs : state.activeEventCctvs,
    })))

    const [eventNm, setEventNm] = useState<string>("");

    const handleEvent = () => {
        if(activeEvent === null){
            setActiveEvent(props.event)
            if(cctvList.length > 0){
                setEventCctvs()
            }else{
                setActiveEventCctvs([]);
            }
        }else{
            if(activeEvent.seqn === props.eventId){
                setActiveEvent(null);
                setActiveEventCctvs([]);
            }else{
                setActiveEvent(props.event);
                if(cctvList.length > 0){
                    setEventCctvs()
                }else{
                    setActiveEventCctvs([]);
                }
            }
        }
    }

    useEffect(() => {
        if(activeEvent){
            if(activeEventCctvs.length === 0){
                if(activeEvent.mappCctvId !== ""){
                    const mappCctvIds = activeEvent.mappCctvId.split(",");
                    const filterCctvs = cctvList.filter((cctv)=> mappCctvIds.includes(cctv.streamId))
                    setActiveEventCctvs(filterCctvs);
                }
            }
        }else{
            if(activeEventCctvs.length > 0 ){
                setActiveEventCctvs([]);
            }
        }
    }, [activeEvent]);

    const setEventCctvs = () => {
        const cctvIds = props.event.mappCctvId.split("/");
        const cctvs = cctvList.filter((cctv)=> cctvIds.includes(cctv.streamId));
        setActiveEventCctvs(cctvs);
    }

    useEffect(() => {
        if(props.type.includes(EVENT_TYPE_GAS.cd)){
            setEventNm(EVENT_TYPE_GAS.nm);
        }else if(props.type === EVENT_TYPE_FLAME.cd){
            setEventNm(EVENT_TYPE_FLAME.nm);
        }else{
            setEventNm(EVENT_TYPE_FIRE.nm);
        }
    }, [props.eventId]);



    return(
        <li className={`list__item ${props.type} ${activeEvent && activeEvent.seqn === props.eventId ? ' active' : ''}`} onClick={() => handleEvent()}>
            <p>{eventNm}</p>
            <p>{props.level}</p>
            <p>{props.building}</p>
            <p>{moment(props.outbDtm,"YYYYMMDDHHmmss").format("YY-MM-DD HH:mm:ss")}</p>
            <p>{props.endDtm !== null ? props.endDtm === "" ? '-' : moment(props.endDtm, "YYYYMMDDHHmmss").format("YY-MM-DD HH:mm:ss") : '-'}</p>
        </li>
    )

}

export default EventLiItem