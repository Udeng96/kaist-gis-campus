import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {
    LEFT_MENU_CAMPUS,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../data_back/const/common.ts";
import {useEffect} from "react";
import CctvPlayer from "./cctvPlayer.tsx";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useFavoriteStore} from "../../../../store_back/zustand/favorite.ts";

const CctvPlayerBox = () => {

    const {activePatrol,activeTab, selectCctvList, setSelectCctvList, activeBuilding} = useLeftStore(useShallow((state) => ({
        activePatrol : state.activePatrol,
        activeTab: state.activeTab,
        selectCctvList: state.selectCctvList,
        setSelectCctvList : state.actions.setSelectCctvList,
        activeBuilding : state.activeBuilding,
    })));

    const {toggleFavorite} = useFavoriteStore(useShallow((state) => ({
        toggleFavorite: state.actions.toggleFavorite
    })));


    const activeMod = useMainStore((state)=> state.activeMod);
    const playList = useGisStore(state=> state.playList);
    const setPlayList = useGisStore(state => state.actions.setPlayList);
    const removeStreamId = useGisStore(state=>state.removeStreamId);
    const setRemoveStreamId = useGisStore(state=> state.actions.setRemoveStreamId);
    const expandStreamId = useGisStore(state=> state.expandStreamId);
    const setExpandStreamId = useGisStore(state=>state.actions.setExpandStreamId);
    const setActiveFullCctv = useGisStore(state => state.actions.setActiveFullCctv);
    const favorStreamId = useGisStore(state=> state.favorStreamId);
    const setFavorStreamId = useGisStore(state=> state.actions.setFavorStreamId);


    const deleteDragPosition = useGisStore(state => state.actions.deleteDragPosition);

    useEffect(()=>{
        if(activeTab.cd === LEFT_MENU_CAMPUS.cd){
            setPlayList(selectCctvList);
        }
    },[selectCctvList, activeTab])

    useEffect(() => {

        if (removeStreamId !== "") {

        }
        if(removeStreamId !== ""){
            if(activeTab.cd === LEFT_MENU_CAMPUS.cd){
                setSelectCctvList(selectCctvList.filter((item)=> item.streamId!==removeStreamId))
                setTimeout(()=>{
                    deleteDragPosition(removeStreamId);
                },100)
                setRemoveStreamId("");
            }
        }
    }, [removeStreamId, activeTab]);

    useEffect(() => {
        if(expandStreamId !== ""){
            if(activeTab.cd === LEFT_MENU_CAMPUS.cd){
                const cctvData = selectCctvList.find(v => v.streamId === expandStreamId);
                if (cctvData) setActiveFullCctv(cctvData);
                setExpandStreamId("");
            }
        }
    }, [expandStreamId, activeTab]);

    useEffect(() => {
        toggleFavorite(favorStreamId)
        setFavorStreamId("")
    }, [favorStreamId]);



    if ((activeTab.cd !== LEFT_MENU_CAMPUS.cd)) return null;
    if (playList.length === 0) return null;
    if(activeMod.cd === LEFT_MOD_PATROL.cd || activeMod.cd === LEFT_MOD_PATROL_REGI.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd) return null;
    if(activePatrol !== null) return null;
    if(activeBuilding!== null) return null;
    return (
        <>
            {
                playList.map((cctv, idx) => (
                <CctvPlayer key={cctv.streamId} cctv={cctv} idx={idx}/>
            ))}
        </>
    );
};

export default CctvPlayerBox;
