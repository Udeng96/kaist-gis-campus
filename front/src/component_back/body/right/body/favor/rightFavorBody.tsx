import Cctv from "../common/cctv/cctv.tsx";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useRightStore} from "../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import EventLi from "../common/event/eventLi.tsx";

const RightFavorBody = () => {
    const {activeFavorBuildingCctvs, activeFavorBuilding} = useLeftStore(useShallow((state)=> ({
        activeFavorBuildingCctvs : state.activeFavorBuildingCctvs,
        activeFavorBuilding : state.activeFavorBuilding
    })));
    const {activeCctvFavorType, activeRightFavorMenu, activeFavorList, activeFavorStartDtm, activeFavorEndDtm} = useRightStore(useShallow((state)=> ({
        activeCctvFavorType : state.activeCctvFavorType,
        activeRightFavorMenu : state.activeRightFavorMenu,
        activeFavorList : state.activeFavorList,
        activeFavorStartDtm : state.activeFavorStartDtm,
        activeFavorEndDtm : state.activeFavorEndDtm
    })))
    return (
        <div className={"content__body"}>
            <ul>
                <Cctv buildingCctvs={activeFavorBuildingCctvs} activeType={activeCctvFavorType.cd} activeMenu={activeRightFavorMenu.cd}/>
                <EventLi activeMenu={activeRightFavorMenu.cd} activeBuilding={activeFavorBuilding} activeList={activeFavorList} activeEnd={activeFavorEndDtm} activeStart={activeFavorStartDtm}></EventLi>
            </ul>
        </div>
    )

}

export default RightFavorBody