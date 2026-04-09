import {useEffect, useState} from "react";
import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import {CCTV_TYPE_WHOLE, LEFT_MENU_FAVORITE, TOAST_TYPE} from "../../../../../../../data_back/const/common.ts";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";

const FavoriteCctvMarker = () => {


    const [hoverCctv, setHoverCctv] = useState<string>("");

    const map = useMap();
    const {
        cctvList,
        selectFavorCctvList,
        activeTab,
        setSelectFavorCctvList,
        activePatrol,
        activeFavorBuilding,
        activeFavorCctvType,
    } = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        selectFavorCctvList: state.selectFavorCctvList,
        activeTab: state.activeTab,
        setSelectFavorCctvList: state.actions.setSelectFavorCctvList,
        activePatrol: state.activePatrol,
        activeFavorBuilding : state.activeFavorBuilding,
        activeFavorCctvType : state.activeFavorCctvType,
    })))

    const setActiveToast = useMainStore(state=> state.actions.setActiveToast);
    const {favorites} = useFavoriteStore(useShallow((state) => ({
        favorites: state.favorites,
    })))
    const {activeZoom, cctvIconShow} = useGisStore(useShallow((state) => ({
        activeZoom : state.activeZoom,
        cctvIconShow: state.cctvIconShow,
    })));

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'favoriteCctvMarker') {
                map.removeLayer(l);
            }
        })

        if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
            if (activePatrol === null) {
                if (cctvIconShow) {
                    let filterCctvs = cctvList.filter((cctv) => activeFavorCctvType.cd === CCTV_TYPE_WHOLE.cd || cctv.plcType === activeFavorCctvType.id);
                    filterCctvs = filterCctvs.filter((cctv)=> favorites.has(cctv.streamId));
                    filterCctvs.forEach((cctv) => {
                        const activeMarker = makeMarker(cctv, activeZoom >= 11);
                        if(activeFavorBuilding === null){
                            activeMarker.on('click', markerClick);
                        }
                        map.addLayer(activeMarker.getLeafletMarker())
                    })
                }
            }
        }
    }, [cctvList, selectFavorCctvList, activeTab, activePatrol, activeZoom, activeFavorBuilding]);
    const makeMarker = (cctvInfo: CCTV_TYPE, zoomOut : boolean) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'favoriteCctvMarker',
                data: cctvInfo,
                icon: renderIcon(cctvInfo, zoomOut),
                interactive:true,
            });

        marker.on('mouseover', ()=> setHoverCctv(cctvInfo.streamId));
        marker.on('mouseout', () => setHoverCctv(""));
        return marker;
    }

    const renderIcon = (cctvInfo : CCTV_TYPE, zoomOut: boolean) => {
        return L.divIcon({
            className: "cctv_zoom_icon",
            html: ReactDOMServer.renderToString(
                <div onMouseOver={() => setHoverCctv(cctvInfo.streamId)} onMouseOut={() => setHoverCctv("")}>
                    <button className={`gis__icon cctv cctv-${cctvInfo.plcType === '1' ? 'in' : cctvInfo.plcType === '2' ? 'out' : 'flame'} ${zoomOut ? 'zoom' : ''}`}
                            style={{zIndex: "1003"}} />
                    {
                        hoverCctv !== "" && hoverCctv === cctvInfo.streamId &&
                        <div className={"tooltip"} style={{zIndex: "1010"}}>{cctvInfo.cctvNm}</div>
                    }
                </div>

            ),
            iconAnchor: [2, 12], // 중앙 하단에 기준점
            iconSize: [24, 24]
        });
    }

    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;

        let newSelectList = [...selectFavorCctvList];

        const alreadyIds = newSelectList.map((item)=> item.streamId);
        if(activeFavorBuilding === null){
            if(!alreadyIds.includes(markerInfo.streamId)){
                setSelectFavorCctvList([...newSelectList, markerInfo]);
            }
        }else{
            setActiveToast({cd : TOAST_TYPE.WARNING, msg:"선택된 건물을 해제한 후, 다시 시도해주세요."});
        }
    };

    return null;

}

export default FavoriteCctvMarker