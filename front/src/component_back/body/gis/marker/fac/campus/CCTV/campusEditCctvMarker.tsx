import {useMap} from "react-leaflet";
import {useRightStore} from "../../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {useEffect} from "react";
import {LEFT_MENU_CAMPUS, RIGHT_MOD_CCTV_EDIT} from "../../../../../../../data_back/const/common.ts";
import L, {type LatLngTuple} from "leaflet";
import {DataMarker} from "../../../../../../../data_back/interface/ccomonInterface.ts";
import ReactDOMServer from "react-dom/server";
import EDIT_TOOLTIP_IMG from "../../../../../../../assets/image/img/img_gis_tootip02_138x42.png";

const CampusEditCctvMarker = () => {
    const map = useMap();

    const {regiCctvLatLng, setRegiCctvLatLng} = useRightStore(useShallow((state) => ({
        regiCctvLatLng: state.regiCctvLatLng,
        setRegiCctvLatLng: state.actions.setRegiCctvLatLng
    })))

    const {activeTab, editCctv} = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        editCctv : state.editCctv
    })))

    const {activeRightMod} = useMainStore(useShallow((state) => ({
        activeRightMod: state.activeRightMod
    })))

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'campusEditCctvMarker') {
                map.removeLayer(l);
            }
        })

        if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
            if (activeRightMod === RIGHT_MOD_CCTV_EDIT) {
                if(editCctv !== null){
                    const marker = makeMarker(regiCctvLatLng);
                    marker.on('dragend',markerDrag);
                    map.addLayer(marker.getLeafletMarker());
                }
            }
        }
    }, [activeTab, activeRightMod, regiCctvLatLng, editCctv]);

    const makeMarker = (cctvLatLng: LatLngTuple) => {
        return new DataMarker(
            [Number(cctvLatLng[0]), Number(cctvLatLng[1])], {
                pane: 'campusEditCctvMarker',
                data: cctvLatLng,
                icon: renderIcon(),
                interactive: true,
                draggable: true,
            });
    }


    const renderIcon = () => {
        return L.divIcon({
            className: "cctv_edit_icon",
            html: ReactDOMServer.renderToString(
                <button className={`gis__icon-wrap`}>
                    <i className="gis__icon modify"></i>
                    <div className="marker-tooltip">
                        <img src={EDIT_TOOLTIP_IMG}/>
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

export default CampusEditCctvMarker