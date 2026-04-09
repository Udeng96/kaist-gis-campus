import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {RIGHT_MOD_EVENT_REGI} from "../../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const EventSearchResult = () => {

    const setActiveRightEventMod = useMainStore().actions.setActiveRightEventMod;
    const {eventList, activeEvent, setActiveEvent} = useLeftStore(useShallow((state)=> ({
        eventList : state.eventList,
        activeEvent : state.activeEvent,
        setActiveEvent : state.actions.setActiveEvent
    })));

    const handleBtn = () => {
        if(activeEvent){
            setActiveEvent(null);
            setTimeout(()=>{
                setActiveRightEventMod(RIGHT_MOD_EVENT_REGI);
            },1000)
        }else{
            setActiveRightEventMod(RIGHT_MOD_EVENT_REGI);
        }

    }

    return(
        <div className="result">
            <p>조회 결과<span>{eventList.length}</span>건</p>
            <button type="button" className="btn-add" onClick={() =>handleBtn()} >수동 이벤트 등록</button>
        </div>
    )

}

export default EventSearchResult