import LastHead from "./lastHead.tsx";
import LastBody from "./lastBody.tsx";
import {useMainStore} from "../../../store_back/zustand/main.ts";
import {MODAL_LAST_EVENT} from "../../../data_back/const/common.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../store_back/zustand/left.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchLastEvents} from "../../../data_back/api/left/leftApi.ts";
import {useEffect} from "react";

const LastEvent = () => {
    const activeModal = useMainStore((state)=> state.activeModal);
    const {lastEventSearchParam, setLastEventList, setActiveLastEvent, setLastEventSearchParam} = useLeftStore(useShallow((state)=>({
        lastEventSearchParam : state.lastEventSearchParam,
        setLastEventList : state.actions.setLastEventList,
        setActiveLastEvent : state.actions.setActiveLastEvent,
        setLastEventSearchParam : state.actions.setLastEventSearchParam
    })));

    const {data : lastEventRes} = useQuery({
        queryKey : ['lastEvents', lastEventSearchParam],
        queryFn : () => fetchLastEvents({eventArea : lastEventSearchParam? lastEventSearchParam.eventArea : '', eventType : lastEventSearchParam?  lastEventSearchParam?.eventType : '', startDtm : lastEventSearchParam ? lastEventSearchParam.startDtm : '', endDtm : lastEventSearchParam ? lastEventSearchParam.endDtm : ''}),
        enabled : lastEventSearchParam !== null && activeModal.cd === MODAL_LAST_EVENT.cd,
        staleTime : Infinity
    })

    useEffect(() => {
        if (lastEventRes) {
            if (lastEventRes.data) {
                setLastEventList(lastEventRes.data);
                setActiveLastEvent(null);
                setLastEventSearchParam(null);
            }else{
                setActiveLastEvent(null);
            }
        }
    }, [lastEventRes]);

    return (
        <div id="modal-hist" className={`modal ${activeModal.cd === MODAL_LAST_EVENT.cd ? '' :'hidden'} `}>
            <div className="dimmed"></div>
            <div className="modal__content ">
                <LastHead/>
                <LastBody/>
            </div>
        </div>
    )
}

export default LastEvent