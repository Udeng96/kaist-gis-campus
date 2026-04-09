import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {MODAL_LAST_EVENT} from "../../../../../../../data_back/const/common.ts";

const EventSearchHead = () => {

    const setActiveModal = useMainStore().actions.setActiveModal;

    return(
        <div className="content__sub-head">
            <h2 className="content__sub-title">이벤트 현황</h2>
            <button type="button" className="btn btn-normal" onClick={() => setActiveModal(MODAL_LAST_EVENT)}>지난 이벤트 내역</button>
        </div>
    )
}

export default EventSearchHead