import {useMap} from "react-leaflet";
import {useGisStore} from "../../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const FacMarker = () => {
    const map = useMap();
    const {activeFac} = useGisStore(useShallow((state)=> ({
        activeFac : state.activeFac,
    })))

    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'facMarker') {
                map.removeLayer(l);
            }
        })

        if(activeFac){
            const facMarker = makeMarker(activeFac);
            map.addLayer(facMarker.getLeafletMarker());
        }
    }, [activeFac]);

    const makeMarker = (facInfo:  {name: string, type:string, cd:string, xcrdnt:string, ycrdnt:string}) => {
        const marker = new DataMarker(
            [Number(facInfo.ycrdnt), Number(facInfo.xcrdnt)], {
                pane: 'facMarker',
                data: facInfo,
                icon: renderIcon(facInfo),
                interactive: true,
            });

        return marker;
    }

    const renderIcon = (facInfo : {name: string, type:string, cd:string, xcrdnt:string, ycrdnt:string}) => {
        return L.divIcon({
            className: "active_addr_icon",
            html: ReactDOMServer.renderToString(
                <button className="gis__icon-wrap">
                    <i className={`gis__icon addr ${activeFac && (activeFac.cd === facInfo.cd) ? "active" : ""}`}></i>
                </button>
            ),
            iconAnchor: [10, 40], // 중앙 하단에 기준점
            iconSize: [45, 63]
        });
    }
    return null;
}

export default FacMarker