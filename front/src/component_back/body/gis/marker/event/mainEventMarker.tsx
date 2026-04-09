import type {BUILDING_TYPE, EVENT_TYPE} from "../../../../../data_back/interface/leftInterface.tsx";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {DataMarker} from "../../../../../data_back/interface/ccomonInterface.ts";
import {useMap} from "react-leaflet";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import {
    LEFT_MENU_CAMPUS, LEFT_MENU_EVENT,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../../data_back/const/common.ts";

const MainEventMarker = () => {

    const map = useMap();
    const activeMod = useMainStore((state)=> state.activeMod);
    const {activeTab, eventList, buildingList,setActiveTab, setActiveEvent} = useLeftStore(useShallow((state)=> ({
        activeTab : state.activeTab,
        eventList : state.eventList,
        buildingList : state.buildingList,
        setActiveTab : state.actions.setActiveTab,
        setActiveEvent : state.actions.setActiveEvent,
    })))

    const [newEventList, setNewEventList] = useState<EVENT_TYPE[]>([]);

    useEffect(() => {
        if(eventList.length > 0){
            const filterEvents = eventList.filter((eventItem)=> eventItem.clrDtm === '');
            setNewEventList(filterEvents);
        }else{
            setNewEventList([]);
        }
    }, [eventList]);


    useEffect(() => {
        map.eachLayer((l) => {
            if (l.options.pane === 'mainEventMarker') {
                map.removeLayer(l);
            }
        })

        if(activeMod.cd !== LEFT_MOD_PATROL.cd && activeMod.cd !== LEFT_MOD_PATROL_REGI.cd && activeMod.cd !== LEFT_MOD_PATROL_EDIT.cd){
            if(newEventList.length > 0 && activeTab.cd === LEFT_MENU_CAMPUS.cd){

                newEventList.forEach((eventItem)=>{
                    const buildId = eventItem.mappBuildingId;
                    const building = buildingList.filter((item)=> item.id === buildId);
                    if(building.length > 0 ){
                        const eventMarker = makeMarker(building[0], eventItem);
                        map.addLayer(eventMarker.getLeafletMarker());
                    }
                })
            }
        }
    }, [activeTab, newEventList, activeMod]);

    const renderIcon = ( eventType: string) => {
        return L.divIcon({
            className: "event_icon",
            html: ReactDOMServer.renderToString(
                <div className="gis__event">
                    <div className="event__dot"></div>
                    <div className="event__dot"></div>
                    <div className="event__dot"></div>
                    <button className="gis__icon-wrap ">
                        <i className={`gis__icon event event-${eventType} `}></i>
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
                pane: 'mainEventMarker',
                data: eventInfo,
                icon: renderIcon(eventInfo.type),
                interactive:true,
            });

        marker.on('click', markerClick);
        return marker;
    }

    const markerClick = (e:any) => {
        const eventInfo = e.target.options.data;
        setActiveTab(LEFT_MENU_EVENT);
        setActiveEvent(eventInfo);
    }

    return null;

}

export default MainEventMarker



