import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import {
    LEFT_MOD_PATROL, LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../../data_back/const/common.ts";
import {useMap} from "react-leaflet";
import type {CCTV_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const PatrolCctvMarker = () => {
    const map = useMap();
    const activeMod = useMainStore((state) => state.activeMod);
    const {cctvList} = useLeftStore(useShallow((state) => ({cctvList: state.cctvList})));
    const [hoverCctv, setHoverCctv] = useState<string>("");

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'patrolCctvMarker') {
                map.removeLayer(l);
            }
        })
        if (activeMod.cd === LEFT_MOD_PATROL_EDIT.cd || activeMod.cd === LEFT_MOD_PATROL_REGI.cd || activeMod.cd === LEFT_MOD_PATROL.cd) {

            cctvList.forEach((cctv) => {
                let activeMarker = makeMarker(cctv, false)
                map.addLayer(activeMarker.getLeafletMarker())
            })
        }
    }, [cctvList, hoverCctv, activeMod]);

    const makeMarker = (cctvInfo: CCTV_TYPE, zoomOut : boolean) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'patrolCctvMarker',
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

    return null;
}

export default PatrolCctvMarker