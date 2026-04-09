import {useMap} from "react-leaflet";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";
import {
    LEFT_MENU_EVENT,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../../data_back/const/common.ts";
import type {BUILDING_TYPE, EVENT_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import {useGisStore} from "../../../../../store_back/zustand/gis.ts";

const EventMarker = () => {

    const map = useMap();
    const activeMod = useMainStore((state) => state.activeMod);
    const {activeTab, eventList, buildingList, setActiveEvent} = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        eventList: state.eventList,
        buildingList: state.buildingList,
        setActiveEvent: state.actions.setActiveEvent,
    })))

    const isCastMode = useGisStore((state) => state.isCastMode);

    const setType = (type: string) => {
        if(type.endsWith("03")){
            return type.replace("03","01");
        }else{
            return type;
        }
    }

    useEffect(() => {

        map.eachLayer((l) => {
            if (l.options.pane === 'eventMarker') {
                map.removeLayer(l);
            }
        })

        if (activeMod.cd !== LEFT_MOD_PATROL.cd && activeMod.cd !== LEFT_MOD_PATROL_REGI.cd && activeMod.cd !== LEFT_MOD_PATROL_EDIT.cd) {
            if (eventList.length > 0 && activeTab.cd === LEFT_MENU_EVENT.cd) {
                eventList.forEach((eventItem) => {
                    const buildId = eventItem.mappBuildingId;
                    const building = buildingList.filter((item) => item.id === buildId);
                    if (building.length > 0) {
                        const eventMarker = makeMarker(building[0], eventItem);
                        if (isCastMode) {
                            eventMarker.off('click');
                        }
                        map.addLayer(eventMarker.getLeafletMarker());
                    }
                })
            }
        }


    }, [activeTab, eventList, activeMod, isCastMode]);


    const renderIcon = (buildingType: BUILDING_TYPE, eventInfo: EVENT_TYPE) => {
        return L.divIcon({
            className: "event_icon",
            html: ReactDOMServer.renderToString(
                <div className="gis__event">
                    {
                        eventInfo.clrDtm === '' &&
                        <>
                            <div className="event__dot"></div>
                            <div className="event__dot"></div>
                            <div className="event__dot"></div>
                        </>
                    }

                    <button className="gis__icon-wrap ">
                    <i className={`gis__icon event event-${setType(eventInfo.type)}`}></i>
                    <div className="name">{buildingType.id}<span>{buildingType.name}</span></div>
                </button>
                </div>
            ),
            iconAnchor: [57, 32], // 중앙 하단에 기준점
            iconSize: [45, 62]
        });
    }

    const makeMarker = (buildInfo: BUILDING_TYPE, eventInfo: EVENT_TYPE) => {
        const marker = new DataMarker(
            [Number(buildInfo.ycrdnt), Number(buildInfo.xcrdnt)], {
                pane: 'eventMarker',
                data: eventInfo,
                icon: renderIcon(buildInfo, eventInfo),
                interactive: true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const markerClick = (e: any) => {
        const eventInfo = e.target.options.data;
        setActiveEvent(eventInfo);
    }
    return null;


}

export default EventMarker