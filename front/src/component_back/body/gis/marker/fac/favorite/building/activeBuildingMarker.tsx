import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useEffect} from "react";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {LEFT_MENU_FAVORITE} from "../../../../../../../data_back/const/common.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";

const ActiveBuildingMarker = () => {
    const map = useMap();

    const {activeFavorBuilding, activeTab, activePatrol, setActiveFavorBuilding} = useLeftStore(useShallow((state) => ({
        activeFavorBuilding: state.activeFavorBuilding,
        activeTab: state.activeTab,
        activePatrol : state.activePatrol,
        setActiveFavorBuilding: state.actions.setActiveFavorBuilding,
    })))

    const {activeZoom, favorBuildingIconShow} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        favorBuildingIconShow: state.favorBuildingIconShow,
    })));

    const {buildFavorites} = useFavoriteStore(useShallow((state) => ({
        buildFavorites: state.buildFavorites,
    })))

    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'activeBuildingMarker') {
                map.removeLayer(l);
            }
        })

        if(favorBuildingIconShow){
            if(activePatrol === null){
                if (activeFavorBuilding) {
                    if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
                        if (buildFavorites.has(activeFavorBuilding.id)) {
                            const activeBuildingMarker = makeMarker(activeFavorBuilding);
                            map.addLayer(activeBuildingMarker.getLeafletMarker());
                        }
                    }
                }
            }
        }
    }, [activeFavorBuilding, buildFavorites, activeTab, favorBuildingIconShow, activeZoom, activePatrol]);


    const renderIcon = (buildingInfo: BUILDING_TYPE) => {
        return L.divIcon({
            className: "active_building_icon",
            html: ReactDOMServer.renderToString(
                <button className="gis__icon-wrap">
                    <i className={`gis__icon building ${activeFavorBuilding && (activeFavorBuilding.id === buildingInfo.id) ? "active" : ""}`}></i>
                    <div className="name">{buildingInfo.id} <span>{activeFavorBuilding ? activeFavorBuilding.name : '-'}</span>
                    </div>
                </button>
            ),
            iconAnchor: [10, 40], // 중앙 하단에 기준점
            iconSize: [45, 63]
        });
    }

    const makeMarker = (buildingInfo: BUILDING_TYPE) => {
        const marker = new DataMarker(
            [Number(buildingInfo.ycrdnt), Number(buildingInfo.xcrdnt)], {
                pane: 'activeBuildingMarker',
                data: buildingInfo,
                icon: renderIcon(buildingInfo),
                interactive: true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const markerClick = (e: any) => {
        const markerInfo = e.target.options.data;
        if (activeFavorBuilding) {
            if (activeFavorBuilding.id === markerInfo.id) {
                setActiveFavorBuilding(null);
            } else {
                setActiveFavorBuilding(markerInfo);
            }
        } else {
            setActiveFavorBuilding(markerInfo);
        }
    }


    return null;

}

export default ActiveBuildingMarker;
