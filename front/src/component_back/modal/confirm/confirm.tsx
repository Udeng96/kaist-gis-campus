import {useMainStore} from "../../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {MODAL_NONE} from "../../../data_back/const/common.ts";
import {
    CCTV_DEL_CONFIRM,
    CCTV_EXIT_CONFIRM,
    CCTV_EXIT_EDIT_CONFIRM,
    CONFIRM_EXIT,
    DATE_CONFIRM,
    EVENT_CLR_CONFIRM,
    EVENT_EXIT_CONFIRM,
    PATROL_DEL_CONFIRM,
    PATROL_EXIT_CONFIRM,
    PATROL_EXIT_EDIT_CONFIRM
} from "../../../data_back/const/confirm.ts";

const Confirm = () => {

    const {activeModal, setActiveModal} = useMainStore(useShallow((state)=> ({
        activeModal : state.activeModal,
        setActiveModal : state.actions.setActiveModal
    })))

    const handleClsBtn = () => {
        setActiveModal(MODAL_NONE);
    }
    const setMsg = (confirmCd:string) => {
        switch (confirmCd){
            case 'DATE_CONFIRM' : return DATE_CONFIRM;
            case 'CCTV_EXIT_CONFIRM' : return CCTV_EXIT_CONFIRM;
            case 'CCTV_EXIT_EDIT_CONFIRM' : return CCTV_EXIT_EDIT_CONFIRM;
            case 'CCTV_DEL_CONFIRM' : return CCTV_DEL_CONFIRM;
            case 'EVENT_EXIT_CONFIRM' : return EVENT_EXIT_CONFIRM;
            case 'PATROL_EXIT_CONFIRM' : return PATROL_EXIT_CONFIRM;
            case 'PATROL_EXIT_EDIT_CONFIRM' : return PATROL_EXIT_EDIT_CONFIRM;
            case 'PATROL_DEL_CONFIRM' : return PATROL_DEL_CONFIRM;
            case 'EVENT_CLR_CONFIRM' : return EVENT_CLR_CONFIRM;
        }
    }

    const handleConfirmBtn = () => {
        setActiveModal({cd:activeModal.cd + "_OK", nm:""});
    }

    return (
        <div id="modal-confirm" className={`modal ${activeModal.cd.includes('CONFIRM') && !activeModal.cd.includes("_OK") ? '' : 'hidden'}`}>
            <div className="dimmed"></div>
            <div className="modal__content confirm ">
                <div className="modal__head">
                    <h2 className="modal__title"><span>{activeModal.nm}</span></h2>
                    <button className="btn-close modal-close" onClick={handleClsBtn}></button>
                </div>
                <div className="modal__message">
                    {setMsg(activeModal.cd)}
                    <br/>
                    {activeModal.cd.includes("EXIT") && CONFIRM_EXIT}
                </div>
                <div className="modal__footer">
                    <button type="button" className="btn btn-normal modal-close" onClick={handleClsBtn}>취소</button>
                    {
                        activeModal.cd.includes("CLR") &&
                        <button type="button" className="btn btn-negative modal-close" onClick={handleConfirmBtn}>종료</button>
                    }
                    {
                        activeModal.cd.includes("DEL") &&
                        <button type="button" className="btn btn-negative modal-close" onClick={handleConfirmBtn}>삭제</button>
                    }
                    {
                        activeModal.cd.includes("EXIT") &&
                        <button type="button" className="btn btn-negative modal-close" onClick={handleConfirmBtn}>나가기</button>
                    }
                    {
                        activeModal.cd.includes("EDIT") && !activeModal.cd.includes("EXIT") &&
                        <button type="button" className="btn btn-primary modal-close" onClick={handleConfirmBtn}>저장</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Confirm