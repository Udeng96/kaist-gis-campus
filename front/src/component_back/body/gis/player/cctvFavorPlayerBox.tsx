import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useFavoriteStore} from "../../../../store_back/zustand/favorite.ts";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useEffect} from "react";
import {
    LEFT_MENU_FAVORITE,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../data_back/const/common.ts";
import CctvPlayer from "./cctvPlayer.tsx";

const CctvFavorPlayerBox = () => {
    const {
        activePatrol,
        activeTab,
        selectFavorCctvList,
        setSelectFavorCctvList,
        activeFavorBuilding
    } = useLeftStore(useShallow((state) => ({
        activePatrol: state.activePatrol,
        activeTab: state.activeTab,
        selectFavorCctvList: state.selectFavorCctvList,
        setSelectFavorCctvList: state.actions.setSelectFavorCctvList,
        activeFavorBuilding: state.activeFavorBuilding,
    })));

    const favorites = useFavoriteStore(state=> state.favorites);

    const activeMod = useMainStore((state) => state.activeMod);
    const playList = useGisStore(state => state.playList);
    const setPlayList = useGisStore(state => state.actions.setPlayList);
    const removeStreamId = useGisStore(state => state.removeStreamId);
    const setRemoveStreamId = useGisStore(state => state.actions.setRemoveStreamId);
    const expandStreamId = useGisStore(state => state.expandStreamId);
    const setExpandStreamId = useGisStore(state => state.actions.setExpandStreamId);
    const setActiveFullCctv = useGisStore(state => state.actions.setActiveFullCctv);

    const deleteFavorDragPosition = useGisStore(state => state.actions.deleteFavorDragPosition);

    useEffect(() => {
        if(activeTab.cd === LEFT_MENU_FAVORITE.cd){
            let newCctvs = selectFavorCctvList.filter((item) => favorites.has(item.streamId));
            setPlayList(newCctvs);
        }
    }, [selectFavorCctvList, favorites, activeTab])

    useEffect(() => {
        if(removeStreamId !== ""){
            if(activeTab.cd === LEFT_MENU_FAVORITE.cd){
                deleteFavorDragPosition(removeStreamId); // 1) drag 삭제 먼저

                setSelectFavorCctvList(
                    selectFavorCctvList.filter(item => item.streamId !== removeStreamId)
                ); // 2) CCTV 리스트 업데이트

                setRemoveStreamId("");
            }
        }
    }, [removeStreamId, activeTab]);

    useEffect(() => {
        if(expandStreamId !== ""){
            if(activeTab.cd === LEFT_MENU_FAVORITE.cd){
                const cctvData = selectFavorCctvList.find(v => v.streamId === expandStreamId);
                if (cctvData) setActiveFullCctv(cctvData);
                setExpandStreamId("");
            }
        }
    }, [expandStreamId, activeTab]);

    if (activeTab.cd !== LEFT_MENU_FAVORITE.cd) return null;
    if (playList.length === 0) return null;
    if(activeMod.cd === LEFT_MOD_PATROL.cd || activeMod.cd === LEFT_MOD_PATROL_REGI.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd) return null;
    if(activePatrol !== null) return null;
    if(activeFavorBuilding!== null) return null;

    return (
        <>
            {
                playList.map((cctv, idx) => (
                    <CctvPlayer key={cctv.streamId} cctv={cctv} idx={idx}/>
                ))}
        </>
    )

}

export default CctvFavorPlayerBox