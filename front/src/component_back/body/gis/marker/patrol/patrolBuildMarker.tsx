import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import {useEffect} from "react";
import {LEFT_MOD_PATROL, LEFT_MOD_PATROL_EDIT, LEFT_MOD_PATROL_REGI} from "../../../../../data_back/const/common.ts";
import type {BUILDING_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const PatrolBuildMarker = () => {

    const map = useMap();
    const {
        buildingList,
        activeTab,
        activePatrol
    } = useLeftStore(useShallow((state) => ({
        buildingList: state.buildingList,
        activeTab: state.activeTab,
        activePatrol: state.activePatrol
    })))

    const {activeMod} = useMainStore(useShallow((state) => ({
        activeMod: state.activeMod
    })))

    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'patrolBuildMarker') {
                map.removeLayer(l);
            }
        })

        // patrol 모드에서.
        if (activeMod.cd === LEFT_MOD_PATROL.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd || activeMod.cd == LEFT_MOD_PATROL_REGI.cd) {
            buildingList.map((building) => {
                const buildingMarker = makeMarker(building);
                map.addLayer(buildingMarker.getLeafletMarker());
            })
        }
    }, [activeTab, buildingList, activeMod, activePatrol]);


    const renderIcon = (buildingInfo: BUILDING_TYPE) => {
        return L.divIcon({
            className: "building_icon",
            html: ReactDOMServer.renderToString(
                <button className="gis__icon-wrap">
                    <i className={`gis__icon building`}></i>
                    <div className="name">{buildingInfo.id}</div>
                </button>
            ),
            iconAnchor: [0, 0], // 중앙 하단에 기준점
            iconSize: [45, 63]
        });
    }

    const makeMarker = (buildingInfo: BUILDING_TYPE) => {
        const marker = new DataMarker(
            [Number(buildingInfo.ycrdnt), Number(buildingInfo.xcrdnt)], {
                pane: 'patrolBuildMarker',
                data: buildingInfo,
                icon: renderIcon(buildingInfo),
                interactive: true,
            });

        return marker;
    }

    return null;

}

export default PatrolBuildMarker