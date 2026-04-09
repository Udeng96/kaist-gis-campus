import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import {useEffect, useState} from "react";
import {CCTV_TYPE_WHOLE, LEFT_MENU_FAVORITE} from "../../../../../../../data_back/const/common.ts";
import ReactDOMServer from "react-dom/server";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";

const FavoriteNumCctvMarker = () => {

    const map = useMap();
    const {
        activeFavorCctvType,
        activeFavorBuilding,
        activeFavorBuildingCctvs,
        selectFavorCctvList,
        activeTab,
        setSelectFavorCctvList,
        activePatrol
    } = useLeftStore(useShallow((state) => ({
        activeFavorCctvType : state.activeFavorCctvType,
        activeFavorBuilding: state.activeFavorBuilding,
        activeFavorBuildingCctvs: state.activeFavorBuildingCctvs,
        selectFavorCctvList: state.selectFavorCctvList,
        activeTab: state.activeTab,
        setSelectFavorCctvList: state.actions.setSelectFavorCctvList,
        activePatrol: state.activePatrol,
    })))

    const {favorites} = useFavoriteStore(useShallow((state) => ({
        favorites: state.favorites,
    })))

    const {activeZoom, cctvIconShow} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        cctvIconShow: state.cctvIconShow,
    })));

    const [filterList, setFilterList] = useState<CCTV_TYPE[]>([]);

    useEffect(() => {
        if(favorites.size > 0){
            if(activeFavorBuilding === null){
                if(selectFavorCctvList.length > 0){
                    let newCctvs = selectFavorCctvList.filter((item)=> favorites.has(item.streamId));
                    setFilterList(newCctvs);
                }else{
                    setFilterList([])
                }
            }else{
                if(activeFavorBuildingCctvs.length > 0){
                    const newCctvs = activeFavorBuildingCctvs.filter((item)=> favorites.has(item.streamId));
                    setFilterList(newCctvs);
                }else{
                    setFilterList([]);
                }
            }
        }else{
            setFilterList([]);
        }
    }, [selectFavorCctvList, activeFavorBuildingCctvs,activeFavorBuilding, favorites]);

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'favoriteNumCctvMarker') {
                map.removeLayer(l);
            }
        })

        if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
            if (activePatrol === null) {
                if (cctvIconShow) {
                    if(activeFavorBuilding === null){
                        let filterCctvs = filterList.filter((cctv) => activeFavorCctvType.cd === CCTV_TYPE_WHOLE.cd || cctv.plcType === activeFavorCctvType.id);
                        filterCctvs = filterCctvs.filter((cctv)=> favorites.has(cctv.streamId))
                        filterCctvs.forEach((cctv, idx) => {
                            const activeMarker = makeMarker(cctv, idx);
                            map.addLayer(activeMarker.getLeafletMarker())
                        })
                    }else{

                        filterList.forEach((cctv, idx) => {
                            const activeMarker = makeMarker(cctv, idx);
                            map.addLayer(activeMarker.getLeafletMarker())
                        })
                    }
                }
            }
        }
    }, [activeFavorCctvType, activeTab, activeFavorBuilding, filterList, activePatrol, activeZoom, cctvIconShow]);

    const makeMarker = (cctvInfo: CCTV_TYPE, idx: number) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'favoriteNumCctvMarker',
                data: cctvInfo,
                icon: renderIcon(cctvInfo, idx),
                interactive: true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const renderIcon = (cctvInfo: CCTV_TYPE, idx: number) => {
        return L.divIcon({
            className: "cctv_favorite_num_icon",
            html: ReactDOMServer.renderToString(
                <button
                    className={`gis__icon cctv cctv-${cctvInfo.plcType === '1' ? 'in' : cctvInfo.plcType === '2' ? 'out' : 'flame'} num `}
                    style={{zIndex: "1003"}}><span>{idx + 1}</span></button>),
            iconAnchor: [6, 20], // 중앙 하단에 기준점
            iconSize: [24, 24]
        });
    }

    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;
        let newSelectList = [...selectFavorCctvList];

        const alreadyIds = newSelectList.map((item)=> item.streamId);

        if(alreadyIds.includes(markerInfo.streamId)){
            let filterCctvs = newSelectList.filter((item)=> item.streamId !== markerInfo.streamId);
            setSelectFavorCctvList(filterCctvs);
        }
    }

    return null
}

export default FavoriteNumCctvMarker