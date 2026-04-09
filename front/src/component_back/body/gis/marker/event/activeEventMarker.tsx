import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";
import {LEFT_MENU_EVENT} from "../../../../../data_back/const/common.ts";
import type {BUILDING_TYPE, EVENT_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import {useGisStore} from "../../../../../store_back/zustand/gis.ts";

const ActiveEventMarker = () => {

    const map = useMap();
    const {activeTab, buildingList, activeEvent, setActiveEvent} = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        buildingList: state.buildingList,
        activeEvent: state.activeEvent,
        setActiveEvent: state.actions.setActiveEvent,
    })))
    const isCastMode = useGisStore((state)=> state.isCastMode);
    const setType = (type: string) => {
        if(type.endsWith("03")){
            return type.replace("03","01");
        }else{
            return type;
        }
    }
    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'activeEventMarker') {
                map.removeLayer(l);
            }
        })

        if ((activeEvent) && activeTab.cd === LEFT_MENU_EVENT.cd) {
            const buildId = activeEvent.mappBuildingId;
            const building = buildingList.filter((item) => item.id === buildId);
            if (building.length > 0) {
                const eventMarker = makeMarker(building[0], activeEvent);
                map.addLayer(eventMarker.getLeafletMarker());

                if(isCastMode){
                    eventMarker.off('click');
                }
            }
        }
    }, [activeEvent, activeTab, isCastMode]);

    const renderIcon = (buildingType : BUILDING_TYPE, eventType: string) => {
        return L.divIcon({
            className: "event_icon",
            html: ReactDOMServer.renderToString(
                <div className="gis__event">
                    <div className="event__dot"></div>
                    <div className="event__dot"></div>
                    <div className="event__dot"></div>
                    <button className="gis__icon-wrap ">
                        <i className={`gis__icon event event-${setType(eventType)} active`}></i>
                        <div className="name">{buildingType.id}<span>{buildingType.name}</span></div>
                    </button>
                </div>
            ),
            iconAnchor: [57, 32], // 중앙 하단에 기준점
            iconSize: [45, 62]
        });
    }

    const makeMarker = (buildInfo: BUILDING_TYPE, eventInfo:EVENT_TYPE) => {
        const marker = new DataMarker(
            [Number(buildInfo.ycrdnt), Number(buildInfo.xcrdnt)], {
                pane: 'activeEventMarker',
                data: eventInfo,
                icon: renderIcon(buildInfo, eventInfo.type),
                interactive:true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const markerClick = (e:any) => {
        const eventInfo = e.target.options.data;
        if(activeEvent){
            if(activeEvent.seqn === eventInfo.seqn){
                setActiveEvent(null);
            }else{
                setActiveEvent(eventInfo);
            }
        }
    }

    return null

}

export default ActiveEventMarker