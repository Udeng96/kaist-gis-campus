import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {RIGHT_MENU_CCTV, RIGHT_MENU_EVENT} from "../../../../../../data_back/const/common.ts";

const RightTabHead = () => {

    const activeBuilding = useLeftStore((state)=> state.activeBuilding);
    const {activeRightMenu, setActiveRightMenu, setIsRefresh} = useRightStore(useShallow((state)=> ({
        activeRightMenu : state.activeRightMenu,
        setActiveRightMenu : state.actions.setActiveRightMenu,
        setIsRefresh : state.actions.setIsRefresh
    })))

    return (
        <div className="content__head">
            <div className="frame">
                <h2 className="content__title content__title--building">{activeBuilding ?  activeBuilding.name : ''} 상세보기</h2>
                <button type="button" className="btn-refresh" onClick={()=>setIsRefresh(true)}>새로고침<i></i></button>
            </div>
            <div className="btn-tab__wrap">
                <button type="button" className={`btn-tab ${activeRightMenu.cd === RIGHT_MENU_CCTV.cd ? 'active':''}`} onClick={()=>setActiveRightMenu(RIGHT_MENU_CCTV)}>CCTV</button>
                <button type="button" className={`btn-tab ${activeRightMenu.cd === RIGHT_MENU_EVENT.cd ? 'active':''}`} onClick={()=>setActiveRightMenu(RIGHT_MENU_EVENT)}>이벤트 내역</button>
            </div>
        </div>
    )

}

export default RightTabHead