import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useEffect} from "react";
import {LEFT_MENU_CAMPUS} from "../../../../../../../data_back/const/common.ts";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const CampBuildMarker = () => {
    const map = useMap();
    const {
        buildingList,
        activeBuilding,
        activeTab,
        setActiveBuilding,
        activePatrol,
        cctvList,
        setActiveBuildingCctvs
    } = useLeftStore(useShallow((state) => ({
        buildingList: state.buildingList,
        activeBuilding: state.activeBuilding,
        activeTab: state.activeTab,
        setActiveBuilding: state.actions.setActiveBuilding,
        activePatrol: state.activePatrol,
        cctvList: state.cctvList,
        setActiveBuildingCctvs: state.actions.setActiveBuildingCctvs,
    })))

    const {activeZoom, buildingIconShow} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        buildingIconShow: state.buildingIconShow,
    })));

    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'campBuildMarker') {
                map.removeLayer(l);
            }
        })

        if (activePatrol === null) {
            if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
                if (buildingIconShow) {
                    if (activeBuilding !== null) {
                        let newFilterBuilding = buildingList.filter((building) => building.id !== activeBuilding.id);
                        newFilterBuilding.forEach((building) => {
                            const buildingMarker = makeMarker(building, activeZoom >= 11);
                            map.addLayer(buildingMarker.getLeafletMarker());
                        })
                    } else {

                        buildingList.forEach((building) => {
                            const buildingMarker = makeMarker(building, activeZoom >= 11);
                            map.addLayer(buildingMarker.getLeafletMarker());
                        })
                    }
                }
            }
        }
    }, [activeTab, buildingList, activeBuilding, activePatrol, buildingIconShow, activeZoom]);

    const makeMarker = (buildingInfo: BUILDING_TYPE, zoomOut: boolean) => {
        const marker = new DataMarker(
            [Number(buildingInfo.ycrdnt), Number(buildingInfo.xcrdnt)], {
                pane: 'campBuildMarker',
                data: buildingInfo,
                icon: renderIcon(buildingInfo, zoomOut),
                interactive: true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const renderIcon = (buildingInfo: BUILDING_TYPE, zoomOut: boolean) => {
        return L.divIcon({
            className: "building_icon",
            html: ReactDOMServer.renderToString(
                <button className="gis__icon-wrap">
                    <i className={`gis__icon building`}></i>
                    {
                        zoomOut &&
                        <div className="name">{buildingInfo.id}</div>
                    }
                </button>
            ),
            iconAnchor: [0, 0], // 중앙 하단에 기준점
            iconSize: [45, 63]
        });
    }

    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;
        setActiveBuildingCctvs(cctvList.filter((cctv) => cctv.building.split("/").includes(markerInfo.id)));
        setActiveBuilding(markerInfo);
    }

    return null;
}

export default CampBuildMarker