import RightTabHead from "./rightTabHead.tsx";
import RightTabBody from "./rightTabBody.tsx";
import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import {LEFT_MENU_CAMPUS, RIGHT_MOD_TAB} from "../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const RightTab = () => {
    const activeRightMod = useMainStore((state)=> state.activeRightMod);
    const {activeTab} = useLeftStore(useShallow((state)=> ({
        activeTab : state.activeTab,
    })));



    return (
        <div className={`content__frame content__frame--details facility ${(activeTab.cd === LEFT_MENU_CAMPUS.cd ) && activeRightMod.cd === RIGHT_MOD_TAB.cd ? 'active' : ''}`}>
            <div className="tab">
                <RightTabHead/>
                <RightTabBody/>
            </div>
        </div>
    )
}

export default RightTab