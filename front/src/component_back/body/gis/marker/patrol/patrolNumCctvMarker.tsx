import {useMap} from "react-leaflet";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import {useGisStore} from "../../../../../store_back/zustand/gis.ts";
import {LEFT_MOD_PATROL_EDIT, LEFT_MOD_PATROL_REGI} from "../../../../../data_back/const/common.ts";
import type {CCTV_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";

const PatrolNumCctvMarker = () => {
    const map = useMap();
    const {activeMod} = useMainStore(useShallow((state) => ({
        activeMod: state.activeMod
    })))
    const {
        regiPatrolCctvList,
        editPatrolCctvList,
    } = useLeftStore(useShallow((state) => ({
        regiPatrolCctvList: state.regiPatrolCctvList,
        editPatrolCctvList : state.editPatrolCctvList,
    })))

    const {activeZoom, castCctvList, setCastCctvList} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        castCctvList: state.castCctvList,
        setCastCctvList: state.actions.setCastCctvList
    })));

    const [cctvList, setCctvList] = useState<CCTV_TYPE[]>([]);

    useEffect(() => {

        if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd){
            setCctvList(regiPatrolCctvList);
        }else if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            setCctvList(editPatrolCctvList);
        }else{
            setCctvList([]);
        }
    }, [activeMod, regiPatrolCctvList, editPatrolCctvList]);

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'patrolNumCctvMarker') {
                map.removeLayer(l);
            }
        })

            if (cctvList.length > 0) {
                cctvList.forEach((cctv, idx) => {
                    const activeMarker = makeMarker(cctv, idx);
                    activeMarker.on('click', markerClick);
                    map.addLayer(activeMarker.getLeafletMarker())
                })
            }
    }, [cctvList, activeZoom]);


    const makeMarker = (cctvInfo: CCTV_TYPE, idx: number) => {
        const marker = new DataMarker(
            [Number(cctvInfo.ycrdnt), Number(cctvInfo.xcrdnt)], {
                pane: 'patrolNumCctvMarker',
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
        const streamIds = castCctvList.map((item) => item.streamId);
        if (streamIds.includes(markerInfo.streamId)) {
            let newSelectList = [...castCctvList];

            const alreadyIds = newSelectList.map((item) => item.streamId);

            if (alreadyIds.includes(markerInfo.streamId)) {
                let filterCctvs = newSelectList.filter((item) => item.streamId !== markerInfo.streamId);
                setCastCctvList(filterCctvs);
            }
        }
    }

    return null;


}

export default PatrolNumCctvMarker