import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {
    LEFT_MENU_EVENT,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../store_back/zustand/main.ts";

const EndBtn = () => {

    const {activeTab,selectCctvList,setSelectCctvList} = useLeftStore(useShallow((state)=> ({
        activeTab : state.activeTab,
        selectCctvList : state.selectCctvList,
        setSelectCctvList : state.actions.setSelectCctvList
    })))

    const activeMod = useMainStore((state)=> state.activeMod);

    return (
        <>
            {
                !(activeMod.cd === LEFT_MOD_PATROL.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd || activeMod.cd == LEFT_MOD_PATROL_REGI.cd)&&
                activeTab.cd !== LEFT_MENU_EVENT.cd &&
                selectCctvList.length > 0 &&
                <button type="button" className="btn-exit" onClick={() => setSelectCctvList([])}>CCTV 모두 닫기</button>
            }
        </>
    )
}

export default EndBtn