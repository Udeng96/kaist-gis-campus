import L from "leaflet";
import {MapContainer, Pane} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import {DEFAULT_LAT_LNG, DEFAULT_ZOOM_LEVEL} from "../../../../data_back/const/gis.ts";
import MapSize from "./mapSize.tsx";
import MapTile from "./mapTile.tsx";
import MapControl from "./mapControl.tsx";
import "proj4leaflet";
import MapMask from "./mapMask.tsx";
import BuildingMarker from "../marker/fac/favorite/building/buildingMarker.tsx";
import ActiveBuildingMarker from "../marker/fac/favorite/building/activeBuildingMarker.tsx";
import EventMarker from "../marker/event/eventMarker.tsx";
import ActiveEventMarker from "../marker/event/activeEventMarker.tsx";
import PatrolMarker from "../marker/patrol/patrolMarker.tsx";
import MainEventMarker from "../marker/event/mainEventMarker.tsx";
import ActiveCampBuildMarker from "../marker/fac/campus/building/activeCampBuildMarker.tsx";
import CampBuildMarker from "../marker/fac/campus/building/campBuildMarker.tsx";
import CampusCctvMarker from "../marker/fac/campus/CCTV/campusCctvMarker.tsx";
import CampusRegiCctvMarker from "../marker/fac/campus/CCTV/campusRegiCctvMarker.tsx";
import CampusNumCctvMarker from "../marker/fac/campus/CCTV/campusNumCctvMarker.tsx";
import EventCctvMarker from "../marker/fac/event/CCTV/eventCctvMarker.tsx";
import EventNumCctvMarker from "../marker/fac/event/CCTV/eventNumCctvMarker.tsx";
import FavoriteCctvMarker from "../marker/fac/favorite/CCTV/favoriteCctvMarker.tsx";
import FavoriteNumCctvMarker from "../marker/fac/favorite/CCTV/favoriteNumCctvMarker.tsx";
import CampusEditCctvMarker from "../marker/fac/campus/CCTV/campusEditCctvMarker.tsx";
import FacMarker from "../marker/addr/facMarker.tsx";
import PatrolNumCctvMarker from "../marker/patrol/patrolNumCctvMarker.tsx";
import PatrolBuildMarker from "../marker/patrol/patrolBuildMarker.tsx";
import CctvPlayerBox from "../player/cctvPlayerBox.tsx";
import OverlayManager from "../player/overlayManager.tsx";
import PatrolCctvMarker from "../marker/patrol/patrolCctvMarker.tsx";
import CctvFavorPlayerBox from "../player/cctvFavorPlayerBox.tsx";


const Map = () => {
    return(
        <MapContainer
            renderer={L.canvas()}
            zoomControl={false}
            zoom={DEFAULT_ZOOM_LEVEL}
            center={DEFAULT_LAT_LNG}
            maxZoom={18}
            minZoom={11}
            attributionControl={false}
            preferCanvas={false}
            scrollWheelZoom={true}
            doubleClickZoom={false}
            closePopupOnClick={false}
            style={{width : '100%', height : '100%', zIndex: '1'}}
        >
            <MapSize/>
            <MapControl/>

            <Pane name={'mapBaseLayer'}>
                <MapTile/>
            </Pane>

            <Pane name={'mapMask'}>
                <MapMask/>
            </Pane>

            {/*building Icon*/}
            <Pane name={'campBuildMarker'} style={{zIndex:1005}}>
                <CampBuildMarker/>
            </Pane>
            <Pane name={'patrolBuildMarker'} style={{zIndex:1005}}>
                <PatrolBuildMarker/>
            </Pane>
            <Pane name={'activeCampBuildMarker'} style={{zIndex:1006}}>
                <ActiveCampBuildMarker/>
            </Pane>

            <Pane name={'buildingMarker'} style={{zIndex:1005}}>
                <BuildingMarker/>
            </Pane>

            <Pane name={'activeBuildingMarker'} style={{zIndex:1006}}>
                <ActiveBuildingMarker/>
            </Pane>

            {/*cctv Icon*/}

            <Pane name={'campusCctvMarker'} style={{zIndex:1010}}>
                <CampusCctvMarker/>
            </Pane>

            <Pane name={'eventCctvMarker'} style={{zIndex:1010}}>
                <EventCctvMarker/>
            </Pane>

            <Pane name={'favoriteCctvMarker'} style={{zIndex:1010}}>
                <FavoriteCctvMarker/>
            </Pane>

            <Pane name={'campusRegiCctvMarker'} style={{zIndex:1200}}>
                <CampusRegiCctvMarker/>
            </Pane>
            <Pane name={'campusEditCctvMarker'} style={{zIndex:1200}}>
                <CampusEditCctvMarker/>
            </Pane>

            <Pane name={'campusNumCctvMarker'} style={{zIndex:1200}}>
                <CampusNumCctvMarker/>
            </Pane>

            <Pane name={'eventNumCctvMarker'} style={{zIndex:1200}}>
                <EventNumCctvMarker/>
            </Pane>

            <Pane name={'favoriteNumCctvMarker'}style={{zIndex:1200}}>
                <FavoriteNumCctvMarker/>
            </Pane>

            <Pane name={"patrolNumCctvMarker"} style={{zIndex:1105}}>
                <PatrolNumCctvMarker/>
            </Pane>

            <Pane name={'patrolMarker'} style={{zIndex:1125}}>
                <PatrolMarker/>
            </Pane>

            <Pane name={'patrolCctvMarker'} style={{zIndex:1105}}>
                <PatrolCctvMarker/>
            </Pane>

            <Pane name={'eventMarker'} style={{zIndex:1430}}>
                <EventMarker/>
            </Pane>

            <Pane name={'facMarker'} style={{zIndex:1130}}>
                <FacMarker/>
            </Pane>

            <Pane name={'mainEventMarker'} style={{zIndex:1421}}>
                <MainEventMarker/>
            </Pane>

            <Pane name={'activeEventMarker'} style={{zIndex:1435}}>
                <ActiveEventMarker/>
            </Pane>


            <Pane name="cctvPlayer" style={{ zIndex: 1500 }} >
            </Pane>

            {/* Polyline Pane들 */}
            <Pane name="polylineBorderPane" style={{ zIndex: 1199, pointerEvents: "none" }} />
            <Pane name="polylinePane" style={{ zIndex: 1198, pointerEvents: "none" }} />

            {/* CctvPlayerBox가 CCTV 목록을 map()로 뿌리는 곳 */}
            <CctvPlayerBox/>

            <CctvFavorPlayerBox/>

            {/* WebRTC Overlay → 반드시 마지막 */}
            <OverlayManager />




        </MapContainer>
    )

}

export default Map