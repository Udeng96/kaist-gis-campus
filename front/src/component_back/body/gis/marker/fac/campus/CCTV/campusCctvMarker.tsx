import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useEffect, useState} from "react";
import {
    CCTV_TYPE_WHOLE,
    LEFT_MENU_CAMPUS,
    LEFT_MOD_PATROL, LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../../../../data_back/const/common.ts";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";

const CampusCctvMarker = () => {

    const [hoverCctv, setHoverCctv] = useState<string>("");

    const map = useMap();
    const {
        cctvList,
        selectCctvList,
        activeTab,
        setSelectCctvList,
        activePatrol,
        activeBuilding,
        activeCctvType
    } = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        selectCctvList: state.selectCctvList,
        activeTab: state.activeTab,
        setSelectCctvList: state.actions.setSelectCctvList,
        activePatrol: state.activePatrol,
        activeBuilding : state.activeBuilding,
        activeCctvType : state.activeCctvType,
    })))
    const {activeZoom, cctvIconShow} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        cctvIconShow: state.cctvIconShow,
    })));

    const activeMod = useMainStore((state)=> state.activeMod);

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'campusCctvMarker') {
                map.removeLayer(l);
            }
        })
        if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
            if (activePatrol === null && activeMod.cd !== LEFT_MOD_PATROL.cd && activeMod.cd !== LEFT_MOD_PATROL_REGI.cd && activeMod.cd !== LEFT_MOD_PATROL_EDIT.cd) {
                if (cctvIconShow) {
                    const filterCctvs = cctvList.filter((cctv) => activeCctvType.cd === CCTV_TYPE_WHOLE.cd || cctv.plcType === activeCctvType.id);
                    filterCctvs.forEach((cctv) => {
                            let activeMarker = makeMarker(cctv, activeZoom >= 11);
                            activeMarker.on('click', markerClick);
                            map.addLayer(activeMarker.getLeafletMarker())
                    })
                }
            }
        }
    }, [cctvList,activeTab, activePatrol, cctvIconShow, activeZoom, activeBuilding, activeCctvType, selectCctvList, hoverCctv, activeMod]);

    const makeMarker = (cctvInfo: CCTV_TYPE, zoomOut : boolean) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'campusCctvMarker',
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

        let newSelectList = [...selectCctvList];

        const alreadyIds = newSelectList.map((item)=> item.streamId);
        if(activeBuilding === null){
            if(!alreadyIds.includes(markerInfo.streamId)){
                setSelectCctvList([...newSelectList, markerInfo]);
            }
        }
    };


    return null;

}

export default CampusCctvMarker