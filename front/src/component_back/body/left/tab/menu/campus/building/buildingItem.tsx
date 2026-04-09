import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import * as React from "react";
import {RIGHT_MOD_CCTV_EDIT, RIGHT_MOD_CCTV_REGI, TOAST_TYPE} from "../../../../../../../data_back/const/common.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import {useRightStore} from "../../../../../../../store_back/zustand/right.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";

const BuildingItem = (props:{building:BUILDING_TYPE}) => {
    const {activeBuilding, setActiveBuilding, cctvList, setActiveBuildingCctvs} = useLeftStore(useShallow((state)=> ({
        activeBuilding : state.activeBuilding,
        setActiveBuilding : state.actions.setActiveBuilding,
        cctvList : state.cctvList,
        setActiveBuildingCctvs : state.actions.setActiveBuildingCctvs
    })));

    const {buildFavorites, toggleBuildFavorite} = useFavoriteStore(useShallow((state)=> ({
        buildFavorites : state.buildFavorites,
        toggleBuildFavorite : state.actions.toggleBuildFavorite
    })));

    const setActiveCctvPage = useRightStore(state => state.actions.setActiveCctvPage)

    const {activeRightMod,setActiveToast} = useMainStore(useShallow((state)=> ({
        activeRightMod : state.activeRightMod,
        setActiveToast : state.actions.setActiveToast
    })))

    const handleItem = () => {
        if(activeRightMod.cd !== RIGHT_MOD_CCTV_REGI.cd && activeRightMod.cd !== RIGHT_MOD_CCTV_EDIT.cd){
            setActiveCctvPage(1);
            if (activeBuilding) {
                // 현재 선택된 건물이 클릭된 건물과 동일한 경우
                if (activeBuilding.id === props.building.id) {
                    setActiveBuilding(null);
                    setActiveBuildingCctvs([]);
                } else {
                    let filterCctvs = cctvList.filter((item)=> item.building.split("/").includes(props.building.id));
                    setActiveBuilding(props.building);
                    setActiveBuildingCctvs(filterCctvs)
                }
            } else {
                let filterCctvs = cctvList.filter((item)=> item.building.split("/").includes(props.building.id));
                setActiveBuilding(props.building);
                setActiveBuildingCctvs(filterCctvs)
            }
        }else{
            setActiveToast({cd:TOAST_TYPE.WARNING, msg : '편집 모드를 종료한 후 다시 시도해주세요.'})
        }
    }

    const handleFavoriteBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, building: BUILDING_TYPE) => {
        e.stopPropagation();
        if(buildFavorites.has(building.id)){
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg : '즐겨찾기가 해제되었습니다.'})
        }else{
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg : '즐겨찾기가 등록되었습니다.'})
        }
        toggleBuildFavorite(props.building.id)
    }

    return(
        <li className={`list__item ${activeBuilding && (activeBuilding.id === props.building.id) ? 'active' : ''}`}
            onClick={() => handleItem()}>
            <div>{props.building.id}</div>
            <div>{props.building.name}</div>
            <div className={"one_star"}>
                <button type="button"
                        onClick={event => handleFavoriteBtn(event, props.building)}
                        className={`btn-favorites ${ buildFavorites.has(props.building.id) ? 'active' : ''}`}></button>
            </div>
        </li>
    )

}

export default BuildingItem