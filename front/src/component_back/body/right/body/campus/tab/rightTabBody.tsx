import Cctv from "../../common/cctv/cctv.tsx";
import EventLi from "../../common/event/eventLi.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";

const RightTabBody = () => {

    const {activeBuildingCctvs, activeBuilding} = useLeftStore(useShallow((state)=> ({
        activeBuildingCctvs : state.activeBuildingCctvs,
        activeBuilding : state.activeBuilding,
    })));
    const {activeCctvType, activeRightMenu, activeEventList, activeEventStartDtm, activeEventEndDtm} = useRightStore(useShallow((state)=> ({
        activeCctvType : state.activeCctvType,
        activeRightMenu : state.activeRightMenu,
        activeEventList : state.activeEventList,
        activeEventStartDtm : state.activeEventStartDtm,
        activeEventEndDtm : state.activeEventEndDtm,
    })))


    return (
        <div className={"content__body"}>
            <ul>
                <Cctv buildingCctvs={activeBuildingCctvs} activeType={activeCctvType.cd} activeMenu={activeRightMenu.cd}/>
                <EventLi activeMenu={activeRightMenu.cd} activeList={activeEventList} activeStart={activeEventStartDtm} activeEnd={activeEventEndDtm} activeBuilding={activeBuilding}/>
            </ul>
        </div>
    )
}

export default RightTabBody