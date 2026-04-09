import {
    CAMPUS_TYPE_FAC,
    LEFT_CAMPUS_E,
    LEFT_CAMPUS_N,
    LEFT_CAMPUS_W,
    LEFT_CAMPUS_WHOLE,
    LEFT_MENU_CAMPUS,
    LEFT_MENU_FAVORITE,
    TOAST_TYPE
} from "../../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import Building from "./building.tsx";

const BuildingArea = (props: { activeArea: { cd: string, nm: string } }) => {
    const {
        activeTab,
        buildingList,
        activeBuildingType,
        setActiveBuildingType,
    } = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        buildingList: state.buildingList,
        activeBuildingType: state.activeBuildingType,
        setActiveBuildingType: state.actions.setActiveBuildingType,
    })));

    const {buildingIconShow, setBuildingIconShow} = useGisStore(useShallow((state) => ({
        buildingIconShow: state.buildingIconShow,
        setBuildingIconShow: state.actions.setBuildingIconShow,
    })))

    const {setActiveToast} = useMainStore(useShallow((state) => ({
        setActiveToast: state.actions.setActiveToast
    })))

    const {buildFavorites} = useFavoriteStore(useShallow((state) => ({
        buildFavorites: state.buildFavorites
    })))

    const LEFT_CAMPUS_LIST = [LEFT_CAMPUS_WHOLE, LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_E];
    const [activeBuildings, setActiveBuildings] = useState<BUILDING_TYPE[]>([]);
    const [buildCnt, setBuildCnt] = useState<number>(0);

    useEffect(() => {
        if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
            const filterBuildings = buildingList.filter((item) => props.activeArea.cd === LEFT_CAMPUS_WHOLE.cd || item.id.includes(props.activeArea.cd));
            setActiveBuildings(filterBuildings);
        } else if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
            const filterBuildings = buildingList.filter((item) => (props.activeArea.cd === LEFT_CAMPUS_WHOLE.cd && buildFavorites.has(item.id)) || (item.id.includes(props.activeArea.cd) && buildFavorites.has(item.id)));
            setActiveBuildings(filterBuildings);
        }
    }, [buildingList, buildFavorites, activeTab, props.activeArea]);


    useEffect(() => {
        if (activeBuildingType.cd === LEFT_CAMPUS_WHOLE.cd) {
            setBuildCnt(activeBuildings.length);
        } else {
            const filterBuildCnt = activeBuildings.filter((building) => building.id.includes(activeBuildingType.cd)).length;
            setBuildCnt(filterBuildCnt);
        }
    }, [activeBuildings, activeBuildingType]);

    const setBuildingArea = (area: { cd: string, nm: string }) => {
        setActiveBuildingType(area);
    }

    const handleIcon = () => {
        if (buildingIconShow) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 해제되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 설정되었습니다.'})
        }
        setBuildingIconShow(!buildingIconShow);
    }

    return (
        <>
            <div className="sub-tab__wrap">
                {
                    LEFT_CAMPUS_LIST.map((campus) => (
                        <button key={`left_tab_${campus.cd}`} type="button"
                                className={`sub-tab ${campus.cd === props.activeArea.cd ? "active" : ""}`}
                                onClick={() => setBuildingArea(campus)}>{campus.nm}</button>
                    ))
                }
            </div>
            <div className="list__container">
                <p className="info">건물 클릭 시 투망 기능이 자동 활성화됩니다.</p>
                <div className={`list list--facility`}>
                    <div className="list__head">
                        <h3 className="list__title">{CAMPUS_TYPE_FAC.nm} 리스트<span>{buildCnt}</span></h3>
                        <div className="list__map">지도 표출
                            <button type="button" className={`btn-map ${buildingIconShow ? '' : 'active'}`}
                                    onClick={() => handleIcon()}></button>
                        </div>
                    </div>
                    <Building buildings={activeBuildings}/>
                </div>
            </div>
        </>


    )

}
export default BuildingArea