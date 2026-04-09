import {useMainStore} from "../../../store_back/zustand/main.ts";
import {DTM_DATE, EVENT_TYPE_WHOLE, LEFT_CAMPUS_WHOLE, MODAL_NONE} from "../../../data_back/const/common.ts";
import {useLeftStore} from "../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const LastHead = () => {

    const setActiveModal = useMainStore().actions.setActiveModal;
    const {setActiveLastEvent, setLastEventSearchParam, setLastEventSearchType, setLastEventSearchArea, setLastEventStartDtm, setLastEventEndDtm} = useLeftStore(useShallow((state)=>({
        setActiveLastEvent : state.actions.setActiveLastEvent,
        setLastEventSearchParam : state.actions.setLastEventSearchParam,
        setLastEventSearchType : state.actions.setLastEventSearchType,
        setLastEventSearchArea : state.actions.setLastEventSearchArea,
        setLastEventStartDtm : state.actions.setLastEventStartDate,
        setLastEventEndDtm : state.actions.setLastEventEndDate
    })));
    const handleClsBtn = () => {
        setActiveLastEvent(null);
        setLastEventSearchType(EVENT_TYPE_WHOLE);
        setLastEventSearchArea(LEFT_CAMPUS_WHOLE);
        setLastEventStartDtm(DTM_DATE.start);
        setLastEventEndDtm(DTM_DATE.end);
        setLastEventSearchParam({eventArea : LEFT_CAMPUS_WHOLE.cd, eventType : EVENT_TYPE_WHOLE.cd, startDtm : DTM_DATE.start, endDtm : DTM_DATE.end });
        setActiveModal(MODAL_NONE);
    }
    return(
        <div className="modal__head">
            <h2 className="modal__title">지난 이벤트 내역</h2>
            <button className="btn-close modal-close" onClick={()=>handleClsBtn()}></button>
        </div>
    )
}
export default LastHead