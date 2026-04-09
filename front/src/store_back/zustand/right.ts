import {create} from "zustand/react";
import {
    CCTV_TYPE_IN,
    CCTV_TYPE_WHOLE,
    EVENT_TYPE_GAS,
    EVENT_TYPE_WHOLE,
    LEFT_CAMPUS_WHOLE,
    RIGHT_MENU_CCTV
} from "../../data_back/const/common.ts";
import type {BUILDING_TYPE, EVENT_TYPE, TreeNode} from "../../data_back/interface/leftInterface.tsx";
import {type LatLngTuple} from "leaflet";
import {DEFAULT_LAT_LNG} from "../../data_back/const/gis.ts";
import type {SensorType} from "../../data_back/interface/ccomonInterface.ts";
import moment from "moment";

interface RightStoreType {
    activeRightMenu : {cd: string, nm: string};
    activeRightFavorMenu : {cd: string, nm: string};
    activeCctvType : {id:string, cd: string, nm: string};
    activeCctvFavorType : {id:string, cd: string, nm: string};
    activeCctvPage : number;
    activeEventCctvPage : number;
    activeFavorCctvPage : number,
    activeEventType : {cd:string, nm:string};
    activeFavorEventType : {cd:string, nm:string};
    activeEventStartDtm : string;
    activeFavorStartDtm : string;
    activeEventEndDtm : string;
    activeFavorEndDtm : string;

    activeEventList : EVENT_TYPE[],
    activeFavorList : EVENT_TYPE[],

    activeEventCctvType : {id: string,cd: string, nm: string},

    regiEventPassiveType : {cd:string, nm:string},
    regiEventPassiveLevel : number,
    regiEventPassiveDtm : string,
    regiEventPassiveHour : string,
    regiEventPassiveMinute : string,
    regiEventPassiveSecond : string,
    regiEventPassiveArea : {cd: string, nm: string},
    regiEventPassiveBuilding : BUILDING_TYPE | null,
    regiEventPassiveSensor : SensorType | null,

    regiTreeList : TreeNode[],
    regiCctvType : {cd:string, nm: string, id:string},
    regiCctvName : string,
    regiCctvRtsp : string,
    regiVmsNum : string,
    regiBuildingYn : boolean,
    regiBuilding : string[],
    regiCctvLatLng : LatLngTuple,
    regiSearchBuilding : string,

    isRefresh : boolean,
    cctvState : string,
    actions : {
        setActiveRightMenu : (menu:{cd:string, nm:string})=>void;
        setActiveRightFavorMenu : (menu:{cd:string, nm:string})=>void;
        setActiveCctvType : (type:{id: string, cd:string, nm:string})=>void;
        setActiveCctvFavorType : (type:{id: string, cd:string, nm:string})=>void;
        setActiveCctvPage : (page:number)=>void;
        setActiveFavorCctvPage : (page:number)=>void,
        setActiveEventCctvPage : (page:number)=>void;
        setActiveEventType : (type:{cd:string, nm:string})=>void;
        setActiveFavorEventType : (type:{cd:string, nm:string})=>void;
        setActiveEventStartDtm : (dtm:string)=>void;
        setActiveFavorStartDtm : (dtm:string)=>void,
        setActiveEventEndDtm : (dtm:string)=>void;
        setActiveFavorEndDtm : (dtm:string) => void,

        setActiveEventList : (list:EVENT_TYPE[])=>void;
        setActiveFavorList : (list:EVENT_TYPE[])=>void,

        setActiveEventCctvType : (type:{id: string, cd:string, nm:string})=>void;

        setRegiEventPassiveType : (type:{cd:string, nm:string})=>void;
        setRegiEventPassiveLevel : (level:number)=>void;
        setRegiEventPassiveDtm : (dtm:string)=>void;
        setRegiEventPassiveHour : (hour:string)=>void;
        setRegiEventPassiveMinute : (minute:string)=>void;
        setRegiEventPassiveSecond : (second:string)=>void;
        setRegiEventPassiveArea : (area:{cd:string, nm:string})=>void;
        setRegiEventPassiveBuilding : (building:BUILDING_TYPE|null)=>void;
        setRegiEventPassiveSensor : (sensor: SensorType | null)=> void;

        setRegiTreeList : (list:TreeNode[])=>void;
        setRegiCctvType : (type:{cd:string, nm:string, id:string})=>void;
        setRegiCctvName : (name:string)=>void;
        setRegiCctvRtsp : (rtsp:string)=>void;
        setRegiVmsNum : (num:string)=>void;
        setRegiBuildingYn : (yn:boolean)=>void;
        setRegiBuilding : (building:string[])=>void;
        setRegiCctvLatLng : (latlng:LatLngTuple)=>void;
        setRegiSearchBuilding : (building:string)=>void;

        setIsRefresh : (refresh:boolean)=>void;
        setCctvState : (state:string)=>void;
    }
}

export const useRightStore = create<RightStoreType>((set)=> ({
    activeRightMenu : RIGHT_MENU_CCTV,
    activeRightFavorMenu : RIGHT_MENU_CCTV,
    activeCctvType : CCTV_TYPE_WHOLE,
    activeCctvFavorType : CCTV_TYPE_WHOLE,
    activeCctvPage : 1,
    activeEventCctvPage : 1,
    activeFavorCctvPage : 1,
    activeEventType : EVENT_TYPE_WHOLE,
    activeFavorEventType : EVENT_TYPE_WHOLE,

    activeEventStartDtm : moment().format("YYYYMMDD"),
    activeEventEndDtm : moment().format("YYYYMMDD"),
    activeFavorStartDtm : moment().format("YYYYMMDD"),
    activeFavorEndDtm : moment().format("YYYYMMDD"),

    activeEventList : [],
    activeFavorList : [],


    activeEventCctvType : CCTV_TYPE_WHOLE,

    regiEventPassiveType : EVENT_TYPE_GAS,
    regiEventPassiveLevel : 1,
    regiEventPassiveDtm : moment().format("YYYYMMDD"),
    regiEventPassiveHour : moment().format("HH"),
    regiEventPassiveMinute : moment().format("mm"),
    regiEventPassiveSecond : moment().format("ss"),
    regiEventPassiveArea : LEFT_CAMPUS_WHOLE,
    regiEventPassiveBuilding : null,
    regiEventPassiveSensor : null,


    regiTreeList : [],
    regiCctvType : CCTV_TYPE_IN,
    regiCctvName : "",
    regiCctvRtsp : "",
    regiVmsNum : "1",
    regiBuildingYn : false,
    regiBuilding : [],
    regiCctvLatLng : DEFAULT_LAT_LNG,
    regiSearchBuilding : "",

    isRefresh : false,
    cctvState : "none",


    actions : {
        setActiveRightMenu: (menu: { cd: string, nm: string }) => set({activeRightMenu: menu}),
        setActiveRightFavorMenu : (menu:{cd:string, nm:string})=>set({activeRightFavorMenu : menu}),
        setActiveCctvFavorType : (type:{id:string, cd:string, nm:string})=>set({activeCctvFavorType : type}),
        setActiveCctvType: (type: {id: string, cd: string, nm: string }) => set({activeCctvType: type}),
        setActiveCctvPage: (page: number) => set({activeCctvPage: page}),
        setActiveFavorCctvPage : (page: number) => set({activeFavorCctvPage : page}),
        setActiveEventCctvPage: (page: number) => set({activeEventCctvPage: page}),
        setActiveEventType: (type: { cd: string, nm: string }) => set({activeEventType: type}),
        setActiveFavorEventType : (type: {cd:string, nm:string})=>set({activeFavorEventType : type}),
        setActiveEventStartDtm: (dtm: string) => set({activeEventStartDtm: dtm}),
        setActiveEventEndDtm: (dtm: string) => set({activeEventEndDtm: dtm}),
        setActiveFavorStartDtm : (dtm:string)=>set({activeFavorStartDtm : dtm}),
        setActiveFavorEndDtm : (dtm:string)=>set({activeFavorEndDtm : dtm}),

        setActiveEventList: (list: EVENT_TYPE[]) => set({activeEventList: list}),
        setActiveFavorList : (list: EVENT_TYPE[]) => set({activeFavorList : list}),

        setActiveEventCctvType: (type: {id: string, cd: string, nm: string }) => set({activeEventCctvType: type}),

        setRegiEventPassiveType: (type: { cd: string, nm: string }) => set({regiEventPassiveType: type}),
        setRegiEventPassiveLevel: (level: number) => set({regiEventPassiveLevel: level}),
        setRegiEventPassiveDtm: (dtm: string) => set({regiEventPassiveDtm: dtm}),
        setRegiEventPassiveHour: (hour: string) => set({regiEventPassiveHour: hour}),
        setRegiEventPassiveMinute: (minute: string) => set({regiEventPassiveMinute: minute}),
        setRegiEventPassiveSecond: (second: string) => set({regiEventPassiveSecond: second}),
        setRegiEventPassiveArea: (area: { cd: string, nm: string }) => set({regiEventPassiveArea: area}),
        setRegiEventPassiveBuilding: (building: BUILDING_TYPE | null) => set({regiEventPassiveBuilding: building}),
        setRegiEventPassiveSensor : (sensor : {cd:string, nm: string , building: string}|null)=> set({regiEventPassiveSensor : sensor}),

        setRegiTreeList : (list: TreeNode[]) => set({regiTreeList: list}),
        setRegiCctvType: (type: { cd: string, nm: string, id:string }) => set({regiCctvType: type}),
        setRegiCctvName: (name: string) => set({regiCctvName: name}),
        setRegiCctvRtsp: (rtsp: string) => set({regiCctvRtsp: rtsp}),
        setRegiVmsNum : (num:string)=>set({regiVmsNum : num}),
        setRegiBuildingYn: (yn: boolean) => set({regiBuildingYn: yn}),
        setRegiBuilding: (building: string[]) => set({regiBuilding: building}),
        setRegiCctvLatLng: (latlng: LatLngTuple) => set({regiCctvLatLng: latlng}),
        setRegiSearchBuilding : (building:string)=>set({regiSearchBuilding : building}),
        setIsRefresh : (refresh:boolean)=>set({isRefresh : refresh}),
        setCctvState : (state:string)=>set({cctvState : state})
    }
}))

