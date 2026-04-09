import * as React from "react";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {TOAST_TYPE} from "../../../../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";

const FavorBuildingItem = ({building}: { building: BUILDING_TYPE }) => {

    const {
        activeFavorBuilding,
        setActiveFavorBuilding,
        cctvList,
        setActiveFavorBuildingCctvs
    } = useLeftStore(useShallow((state) => ({
        activeFavorBuilding: state.activeFavorBuilding,
        setActiveFavorBuilding: state.actions.setActiveFavorBuilding,
        cctvList: state.cctvList,
        setActiveFavorBuildingCctvs: state.actions.setActiveFavorBuildingCctvs
    })));

    const {favourites,buildFavorites, toggleBuildFavorite} = useFavoriteStore(useShallow((state) => ({
        favourites: state.favorites,
        buildFavorites: state.buildFavorites,
        toggleBuildFavorite: state.actions.toggleBuildFavorite
    })));

    const setActiveToast = useMainStore(state=> state.actions.setActiveToast)


    const handleItem = () => {
        if (activeFavorBuilding) {
            // 현재 선택된 건물이 클릭된 건물과 동일한 경우
            if (activeFavorBuilding.id === building.id) {
                setActiveFavorBuilding(null);
                setActiveFavorBuildingCctvs([]);
            } else {
                let filterFavorites = cctvList.filter((item) => favourites.has(item.streamId));
                let filterCctvs = filterFavorites.filter((item) => item.building.split(",").includes(building.id));
                setActiveFavorBuilding(building);
                setActiveFavorBuildingCctvs(filterCctvs)
            }
        } else {
            let filterCctvs = cctvList.filter((item) => item.building.split(",").includes(building.id));
            setActiveFavorBuilding(building);
            setActiveFavorBuildingCctvs(filterCctvs)
        }
    }

    const handleFavoriteBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, building: BUILDING_TYPE) => {
        e.stopPropagation();
        if (buildFavorites.has(building.id)) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '즐겨찾기가 해제되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '즐겨찾기가 등록되었습니다.'})
        }
        toggleBuildFavorite(building.id)
    }

    return (
        <li className={`list__item ${activeFavorBuilding && (activeFavorBuilding.id === building.id) ? 'active' : ''}`}
            onClick={() => handleItem()}>
            <div>{building.id}</div>
            <div>{building.name}</div>
            <div className={"one_star"}>
                <button type="button"
                        onClick={event => handleFavoriteBtn(event, building)}
                        className={`btn-favorites ${buildFavorites.has(building.id) ? 'active' : ''}`}></button>
            </div>
        </li>
    )

}

export default FavorBuildingItem