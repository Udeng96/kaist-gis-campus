import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";
import type {CCTV_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import {LEFT_MOD_PATROL} from "../../../../../data_back/const/common.ts";

const PatrolMarker = () => {
    const map = useMap();
    const activeMod = useMainStore((state)=> state.activeMod);
    const {activePatrol, activePatrolCctvList, activePatrolCctvIndex} = useLeftStore(useShallow((state)=> ({
        activePatrol : state.activePatrol,
        activePatrolCctvList : state.activePatrolCctvList,
        activePatrolCctvIndex : state.activePatrolCctvIndex
    })))

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'patrolMarker') {
                map.removeLayer(l);
            }
        })

        if(activeMod.cd === LEFT_MOD_PATROL.cd && activePatrol !==null) {
            if(activePatrolCctvList.length > 0){
                activePatrolCctvList.forEach((cctv, idx)=>{
                    const activeMarker =makeMarker(cctv, idx);
                    map.addLayer(activeMarker.getLeafletMarker())
                })
            }
        }

    },[activePatrol, activePatrolCctvList, activePatrolCctvIndex, activeMod]);

    const renderIcon = (cctvInfo : CCTV_TYPE, idx:number) => {
        return L.divIcon({
            className: "cctv_patrol_icon",
            html: ReactDOMServer.renderToString(
                <div className="gis__patrol">
                    <button className={`gis__icon cctv cctv-${cctvInfo.plcType === '1' ? 'in' : cctvInfo.plcType === '2' ? 'out' : 'flame'} num `} disabled={activePatrolCctvIndex !== idx }><span>{idx+1}</span></button>
                    {
                        activePatrolCctvIndex===idx &&
                        <>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </>
                    }

                </div>

            ),
            iconAnchor: [17, 20], // 중앙 하단에 기준점
            iconSize: [24, 24]
        });
    }

    const makeMarker = (cctvInfo: CCTV_TYPE, idx:number) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'patrolMarker',
                data: cctvInfo,
                icon: renderIcon(cctvInfo, idx),
                interactive:true,
            });

        return marker;
    }

    return null;

}

export default PatrolMarker