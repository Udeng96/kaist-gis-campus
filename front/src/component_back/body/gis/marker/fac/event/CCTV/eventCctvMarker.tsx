import {useEffect, useState} from "react";
import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {LEFT_MENU_EVENT} from "../../../../../../../data_back/const/common.ts";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const EventCctvMarker = () => {

    const [hoverCctv, setHoverCctv] = useState<string>("");

    const map = useMap();
    const {
        cctvList,
        activeTab,
        activePatrol,
        activeEventCctvs
    } = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        activeTab: state.activeTab,
        activePatrol: state.activePatrol,
        activeEventCctvs : state.activeEventCctvs
    })))
    const {activeZoom, isCastMode, castCctvList, setCastCctvList} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        isCastMode : state.isCastMode,
        castCctvList : state.castCctvList,
        setCastCctvList : state.actions.setCastCctvList,
    })));

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'eventCctvMarker') {
                map.removeLayer(l);
            }
        })
        if (activeTab.cd === LEFT_MENU_EVENT.cd) {
            if (activePatrol === null) {
                cctvList.forEach((cctv) => {
                    const activeMarker = makeMarker(cctv, activeZoom >= 11);
                    if(isCastMode){
                        activeMarker.on('click', markerClick);
                    }

                    activeMarker.on('mouseover', ()=> setHoverCctv(cctv.streamId));
                    activeMarker.on('mouseout', () => setHoverCctv(""));
                    map.addLayer(activeMarker.getLeafletMarker())
                })
            }
        }
    }, [cctvList, activeTab, activePatrol, isCastMode, activeZoom, hoverCctv]);

    const makeMarker = (cctvInfo: CCTV_TYPE, zoomOut: boolean) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'eventCctvMarker',
                data: cctvInfo,
                icon: renderIcon(cctvInfo, zoomOut),
                interactive: true,
            });
        return marker;
    }

    const renderIcon = (cctvInfo: CCTV_TYPE, zoomOut: boolean) => {
        return L.divIcon({
            className: "cctv_event_zoom_icon",
            html: ReactDOMServer.renderToString(
                <div onMouseOver={() => setHoverCctv(cctvInfo.streamId)} onMouseOut={() => setHoverCctv("")}>
                    <button
                        className={`gis__icon cctv cctv-${cctvInfo.plcType === '1' ? 'in' : cctvInfo.plcType === '2' ? 'out' : 'flame'} ${zoomOut ? 'zoom' : ''}`}/>
                    {
                        hoverCctv !== "" && hoverCctv === cctvInfo.streamId &&
                        <div className={"tooltip"}>{cctvInfo.cctvNm}</div>
                    }
                </div>
            ),
            iconAnchor: [2, 12], // 중앙 하단에 기준점
            iconSize: [24, 24]
        });
    }

    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;

        const castCctvIds = castCctvList.map((item)=> item.streamId);
        const eventCctvIds = activeEventCctvs.map((item)=> item.streamId);

        const alreadyIds = [...castCctvIds, eventCctvIds];
        if(!alreadyIds.includes(markerInfo.streamId)){
            setCastCctvList([...castCctvList, markerInfo])
        }
    };


    return null;

}

export default EventCctvMarker