import {useEffect, useState} from "react";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import {
    CAMPUS_TYPE_FAC,
    LEFT_CAMPUS_E,
    LEFT_CAMPUS_N,
    LEFT_CAMPUS_W,
    LEFT_CAMPUS_WHOLE,
    TOAST_TYPE
} from "../../../../../../../data_back/const/common.ts";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import FavorBuilding from "./favorBuilding.tsx";

const FavorBuildingArea = ({activeArea}: { activeArea: { cd: string, nm: string } }) => {

    const {
        activeTab,
        buildingList,
        activeFavorBuildingType,
        setActiveFavorBuildingType,
    } = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        buildingList: state.buildingList,
        activeFavorBuildingType: state.activeFavorBuildingType,
        setActiveFavorBuildingType: state.actions.setActiveFavorBuildingType,
    })));

    const {favorBuildingIconShow, setFavorBuildingIconShow} = useGisStore(useShallow((state) => ({
        favorBuildingIconShow: state.favorBuildingIconShow,
        setFavorBuildingIconShow: state.actions.setFavorBuildingIconShow,
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
        const filterBuildings = buildingList.filter((item) => (activeArea.cd === LEFT_CAMPUS_WHOLE.cd && buildFavorites.has(item.id)) || (item.id.includes(activeArea.cd) && buildFavorites.has(item.id)));
        setActiveBuildings(filterBuildings);
    }, [buildingList, buildFavorites, activeTab, activeArea]);

    useEffect(() => {
        if (activeFavorBuildingType.cd === LEFT_CAMPUS_WHOLE.cd) {
            setBuildCnt(activeBuildings.length);
        } else {
            const filterBuildCnt = activeBuildings.filter((building) => building.id.includes(activeFavorBuildingType.cd)).length;
            setBuildCnt(filterBuildCnt);
        }
    }, [activeBuildings, activeFavorBuildingType]);

    const setBuildingArea = (area: { cd: string, nm: string }) => {
            setActiveFavorBuildingType(area);
    }
    const handleIcon = () => {
        if (favorBuildingIconShow) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 해제되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 설정되었습니다.'})
        }
        setFavorBuildingIconShow(!favorBuildingIconShow);
    }

    return (
        <>
            <div className="sub-tab__wrap">
                {
                    LEFT_CAMPUS_LIST.map((campus) => (
                        <button key={`left_tab_${campus.cd}`} type="button"
                                className={`sub-tab ${campus.cd === activeArea.cd ? "active" : ""}`}
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
                            <button type="button" className={`btn-map ${favorBuildingIconShow ? '' : 'active'}`}
                                    onClick={() => handleIcon()}></button>
                        </div>
                    </div>
                    <FavorBuilding buildings={activeBuildings}/>
                </div>
            </div>
        </>


    )





}
export default FavorBuildingArea