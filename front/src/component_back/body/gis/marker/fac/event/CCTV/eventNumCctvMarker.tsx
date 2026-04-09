import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useEffect} from "react";
import {LEFT_MENU_EVENT} from "../../../../../../../data_back/const/common.ts";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const EventNumCctvMarker = () => {
    const map = useMap();
    const {
        activeTab,
        activeEventCctvs,
        activePatrol,
        activeEvent
    } = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        activeEventCctvs: state.activeEventCctvs,
        activePatrol: state.activePatrol,
        activeEvent : state.activeEvent
    })))

    const {activeZoom, isCastMode, castCctvList, setCastCctvList} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        isCastMode: state.isCastMode,
        castCctvList : state.castCctvList,
        setCastCctvList : state.actions.setCastCctvList
    })));

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'eventNumCctvMarker') {
                map.removeLayer(l);
            }
        })

        if (activeTab.cd === LEFT_MENU_EVENT.cd) {
            if (activePatrol === null) {
                if (activeEventCctvs.length ===  0) {
                    if(castCctvList.length > 0){
                        castCctvList.forEach((cctv, idx) => {
                            const activeMarker = makeMarker(cctv, idx);
                            if(isCastMode){
                                activeMarker.on('click', markerClick);
                            }
                            map.addLayer(activeMarker.getLeafletMarker())
                        })
                    }
                }else{
                    activeEventCctvs.map((cctv, idx)=>{
                        const activeMarker = makeMarker(cctv, idx);
                        map.addLayer(activeMarker.getLeafletMarker())
                    })
                    if(castCctvList.length > 0){
                        castCctvList.forEach((cctv, idx) => {
                            const activeMarker = makeMarker(cctv, activeEventCctvs.length + idx);
                            if(isCastMode){
                                activeMarker.on('click', markerClick);
                            }
                            map.addLayer(activeMarker.getLeafletMarker())
                        })
                    }
                }
            }
        }
    }, [activeEventCctvs, castCctvList, activeTab, activePatrol, activeZoom, isCastMode, activeEvent]);


    const makeMarker = (cctvInfo: CCTV_TYPE, idx: number) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'eventNumCctvMarker',
                data: cctvInfo,
                icon: renderIcon(cctvInfo, idx),
                interactive: true,
            });

        return marker;
    }

    const renderIcon = (cctvInfo: CCTV_TYPE, idx: number) => {
        return L.divIcon({
            className: "cctv_num_icon",
            html: ReactDOMServer.renderToString(
                <button
                    className={`gis__icon cctv cctv-${cctvInfo.plcType === '1' ? 'in' : cctvInfo.plcType === '2' ? 'out' : 'flame'} num `}
                    style={{zIndex: "1003"}}><span>{idx + 1}</span></button>),
            iconAnchor: [6, 20], // 중앙 하단에 기준점
            iconSize: [24, 24]
        });
    }

    // 투망이 된 것만 클릭 이벤트가 있어야 한다.
    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;
        const streamIds = castCctvList.map((item)=> item.streamId);
        if(streamIds.includes(markerInfo.streamId)){
            let newSelectList = [...castCctvList];

            const alreadyIds = newSelectList.map((item)=> item.streamId);

            if(alreadyIds.includes(markerInfo.streamId)){
                let filterCctvs = newSelectList.filter((item)=> item.streamId !== markerInfo.streamId);
                setCastCctvList(filterCctvs);
            }
        }
    }

    return null;


}

export default EventNumCctvMarker