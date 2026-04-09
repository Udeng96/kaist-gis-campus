import {LEFT_MENU_FAVORITE, RIGHT_MOD_TAB} from "../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import RightFavorHead from "./rightFavorHead.tsx";
import RightFavorBody from "./rightFavorBody.tsx";

const RightFavor = () => {

    const activeTab = useLeftStore(state=> state.activeTab);
    const activeRightFavorMod = useMainStore(state=> state.activeRightFavorMod)

    return(
        <div className={`content__frame content__frame--details facility ${activeTab.cd === LEFT_MENU_FAVORITE.cd && activeRightFavorMod.cd === RIGHT_MOD_TAB.cd ? 'active' : ''}`}>
            <div className="tab">
                <RightFavorHead/>
                <RightFavorBody/>
            </div>
        </div>

    )

}

export default RightFavor