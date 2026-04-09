import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useEffect} from "react";
import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import {LEFT_MENU_FAVORITE} from "../../../../../../../data_back/const/common.ts";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";

const BuildingMarker = () => {
    const map = useMap();
    const {
        buildingList,
        activeFavorBuilding,
        activeTab,
        setActiveFavorBuilding,
        activePatrol
    } = useLeftStore(useShallow((state) => ({
        buildingList: state.buildingList,
        activeFavorBuilding: state.activeFavorBuilding,
        activeTab: state.activeTab,
        setActiveFavorBuilding: state.actions.setActiveFavorBuilding,
        activePatrol: state.activePatrol
    })))

    const {buildFavorites} = useFavoriteStore(useShallow((state) => ({
        buildFavorites: state.buildFavorites,
    })))

    const {activeZoom, buildingIconShow} = useGisStore(useShallow((state) => ({
        activeZoom: state.activeZoom,
        buildingIconShow: state.buildingIconShow,
    })));

    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'buildingMarker') {
                map.removeLayer(l);
            }
        })

        if (activePatrol === null) {
            if (buildingIconShow) {
                if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
                    if(buildingList.length > 0){
                        let filterBuilding = buildingList.filter((building) => buildFavorites.has(building.id))
                        if(activeFavorBuilding !== null){
                            filterBuilding = filterBuilding.filter((building)=> building.id !== activeFavorBuilding.id);
                        }
                        filterBuilding.forEach((building) => {
                            const buildingMarker = makeMarker(building, activeZoom >= 11);
                            map.addLayer(buildingMarker.getLeafletMarker());
                        })

                    }
                }
            }
        }
    }, [activeTab, buildingList, buildFavorites, activeFavorBuilding, activePatrol, buildingIconShow, activeZoom]);

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

    const makeMarker = (buildingInfo: BUILDING_TYPE, zoomOut: boolean) => {
        const marker = new DataMarker(
            [Number(buildingInfo.ycrdnt), Number(buildingInfo.xcrdnt)], {
                pane: 'buildingMarker',
                data: buildingInfo,
                icon: renderIcon(buildingInfo, zoomOut),
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

export default BuildingMarker