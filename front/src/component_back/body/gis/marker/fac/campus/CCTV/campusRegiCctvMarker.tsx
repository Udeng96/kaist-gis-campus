import {useMap} from "react-leaflet";
import {useRightStore} from "../../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {useEffect} from "react";
import {LEFT_MENU_CAMPUS, RIGHT_MOD_CCTV_REGI} from "../../../../../../../data_back/const/common.ts";
import L, {type LatLngTuple} from "leaflet";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import ReactDOMServer from "react-dom/server";
import SAVE_TOOLTIP_IMG from "../../../../../../../assets/image/img/img_gis_tootip_146x42.png";

const CampusRegiCctvMarker = () => {
    const map = useMap();

    const {regiCctvLatLng, setRegiCctvLatLng} = useRightStore(useShallow((state) => ({
        regiCctvLatLng: state.regiCctvLatLng,
        setRegiCctvLatLng: state.actions.setRegiCctvLatLng
    })))

    const {activeTab} = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab
    })))

    const {activeRightMod} = useMainStore(useShallow((state) => ({
        activeRightMod: state.activeRightMod
    })))

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'campusRegiCctvMarker') {
                map.removeLayer(l);
            }
        })

        if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
            if (activeRightMod === RIGHT_MOD_CCTV_REGI) {
                const marker = makeMarker(regiCctvLatLng);
                marker.on('dragend',markerDrag);
                map.addLayer(marker.getLeafletMarker());
            }
        }
    }, [activeTab, activeRightMod, regiCctvLatLng]);

    const makeMarker = (cctvLatLng: LatLngTuple) => {
        return new DataMarker(
            [Number(cctvLatLng[0]), Number(cctvLatLng[1])], {
                pane: 'campusRegiCctvMarker',
                data: cctvLatLng,
                icon: renderIcon(),
                interactive: true,
                draggable: true,
            });
    }


    const renderIcon = () => {
        return L.divIcon({
            className: "cctv_regi_icon",
            html: ReactDOMServer.renderToString(
                <button className={`gis__icon-wrap`}>
                    <i className="gis__icon register"></i>
                    <div className="marker-tooltip">
                        <img src={SAVE_TOOLTIP_IMG}/>
                    </div>
                </button>),
            iconAnchor: [17, 20], // 중앙 하단에 기준점
            iconSize: [24, 24]
        });
    }

    const markerDrag = (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setRegiCctvLatLng([lat, lng]);
    }


    return null;
}

export default CampusRegiCctvMarker