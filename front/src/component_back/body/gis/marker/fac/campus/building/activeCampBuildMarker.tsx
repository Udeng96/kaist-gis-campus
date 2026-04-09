import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";
import {LEFT_MENU_CAMPUS} from "../../../../../../../data_back/const/common.ts";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const ActiveCampBuildMarker = () => {
    const map = useMap();
    const {activeBuilding, activeTab, setActiveBuilding} = useLeftStore(useShallow((state) => ({
        activeBuilding: state.activeBuilding,
        activeTab: state.activeTab,
        setActiveBuilding: state.actions.setActiveBuilding,
    })))

    const {activeZoom, buildingIconShow} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        buildingIconShow: state.buildingIconShow,
    })));

    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'activeCampBuildMarker') {
                map.removeLayer(l);
            }
        })

        if(buildingIconShow) {
            if (activeBuilding) {
                if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
                    const activeBuildingMarker = makeMarker(activeBuilding);
                    map.addLayer(activeBuildingMarker.getLeafletMarker());
                }
            }
        }

    }, [activeBuilding, activeTab, activeZoom]);

    const makeMarker = (buildingInfo: BUILDING_TYPE) => {
        const marker = new DataMarker(
            [Number(buildingInfo.ycrdnt), Number(buildingInfo.xcrdnt)], {
                pane: 'activeCampBuildMarker',
                data: buildingInfo,
                icon: renderIcon(buildingInfo),
                interactive: true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const renderIcon = (buildingInfo: BUILDING_TYPE) => {
        return L.divIcon({
            className: "active_building_icon",
            html: ReactDOMServer.renderToString(
                <button className="gis__icon-wrap">
                    <i className={`gis__icon building ${activeBuilding && (activeBuilding.id === buildingInfo.id) ? "active" : ""}`}></i>
                    <div className="name">{buildingInfo.id} <span>{activeBuilding ? activeBuilding.name : '-'}</span>
                    </div>
                </button>
            ),
            iconAnchor: [10, 40], // 중앙 하단에 기준점
            iconSize: [45, 63]
        });
    }

    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;
        if (activeBuilding) {
            if (activeBuilding.id === markerInfo.id) {
                setActiveBuilding(null);
            } else {
                setActiveBuilding(markerInfo);
            }
        } else {
            setActiveBuilding(markerInfo);
        }
    }

    return null
}

export default ActiveCampBuildMarker