import {create} from "zustand/react";
import {
    CCTV_TYPE_WHOLE,
    DTM_DATE,
    EVENT_TYPE_WHOLE,
    LEFT_CAMPUS_N,
    LEFT_CAMPUS_WHOLE,
    LEFT_MENU_CAMPUS,
    PATROL_SORT_RECENT,
    PATROL_TIME_TEN_SECONDS
} from "../../data_back/const/common.ts";
import type {BUILDING_TYPE, CCTV_TYPE, EVENT_TYPE, PATROL_TYPE} from "../../data_back/interface/leftInterface.tsx";

interface LeftStoreType {
    alarmOn: boolean,
    activeTab: { cd: string, nm: string },

    activeBuildingType : {cd: string, nm:string}
    activeFavorBuildingType : {cd:string, nm: string},
    buildingList: BUILDING_TYPE[],
    favorBuildingList : BUILDING_TYPE[],

    activeBuilding: BUILDING_TYPE | null,
    activeFavorBuilding : BUILDING_TYPE | null,

    activeBuildingCctvs : CCTV_TYPE[],
    activeFavorBuildingCctvs : CCTV_TYPE[],

    activeCctvType : { id: string, cd: string, nm: string },
    activeFavorCctvType : { id: string, cd: string, nm: string },
    activeEventCctvType : { id: string, cd: string, nm: string },
    cctvList: CCTV_TYPE[],
    selectCctvList: CCTV_TYPE[],
    selectFavorCctvList : CCTV_TYPE[],
    editCctv: CCTV_TYPE | null,
    eventSearchType: { cd: string, nm: string },
    eventSearchArea: { cd: string, nm: string },
    eventSearchParam : {eventArea : string, eventType : string} | null,
    lastEventParam : {eventArea : string, eventType : string} | null,
    eventList : EVENT_TYPE[],
    activeEvent: null | EVENT_TYPE,
    activeEventCctvs: CCTV_TYPE[],

    lastEventSearchType : { cd: string, nm: string },
    lastEventSearchArea : { cd: string, nm: string },
    lastEventSearchParam : {eventArea : string, eventType : string, startDtm : string, endDtm : string} | null,
    lastEventStartDate : string,
    lastEventEndDate : string,
    lastEventList : EVENT_TYPE[],
    lastEventPage : number,
    activeLastEvent : EVENT_TYPE | null,

    openPatrolList: string[],
    activeEditPatrolCd: string;
    activeGrp: string,
    activeGrpSort: { cd: string, nm: string },

    regiPatrolNm : string,
    regiPatrolArea : {cd:string, nm:string},
    regiPatrolCctvList : CCTV_TYPE[],

    editPatrol : PATROL_TYPE | null,
    editPatrolNm : string,
    editPatrolArea : {cd:string, nm:string},
    editPatrolCctvList : CCTV_TYPE[],

    patrolList : PATROL_TYPE[],
    activePatrol : PATROL_TYPE | null,

    activePatrolCctvList : CCTV_TYPE[],
    activePatrolCctvIndex : number,
    activePatrolFullTime : {cd:string, second:number, nm : string},
    activePatrolPlayTime : number,


    actions: {
        setAlarmOn: (on: boolean) => void,
        setActiveTab: (tab: { cd: string, nm: string }) => void,

        setActiveBuildingType : (type: {cd: string, nm:string}) => void,
        setActiveFavorBuildingType : (type: {cd: string, nm:string}) => void,
        setBuildingList: (list: BUILDING_TYPE[]) => void,
        setFavorBuildingList : (list: BUILDING_TYPE[]) => void,
        setActiveBuilding: (building: BUILDING_TYPE | null) => void,
        setActiveFavorBuilding : (building: BUILDING_TYPE | null) => void,
        setActiveBuildingCctvs: (cctvs: CCTV_TYPE[]) => void,
        setActiveFavorBuildingCctvs: (cctvs: CCTV_TYPE[]) => void,

        setActiveCctvType: (type: { id: string, cd: string, nm: string }) => void,
        setActiveFavorCctvType : (type: { id: string, cd: string, nm: string }) => void,
        setActiveEventCctvType: (type: { id: string, cd: string, nm: string }) => void,
        setCctvList: (list: CCTV_TYPE[]) => void,
        setSelectCctvList: (list: CCTV_TYPE[]) => void;
        setSelectFavorCctvList : (list: CCTV_TYPE[]) => void;
        setEditCctv: (cctv: CCTV_TYPE | null) => void;

        setEventSearchType: (type: { cd: string, nm: string }) => void,
        setEventSearchArea: (area: { cd: string, nm: string }) => void,
        setEventSearchParam : (param : {eventArea : string, eventType : string} | null) => void,
        setLastEventParam : (param : {eventArea : string, eventType : string} | null) => void,
        setEventList : (event : EVENT_TYPE[]) => void,
        setActiveEvent: (event: EVENT_TYPE | null) => void;
        setActiveEventCctvs: (cctvs: CCTV_TYPE[]) => void,

        setLastEventSearchType : (type: { cd: string, nm: string }) => void,
        setLastEventSearchArea : (area: { cd: string, nm: string }) => void,
        setLastEventSearchParam : (param : {eventArea : string, eventType : string, startDtm : string, endDtm : string} | null) => void,
        setLastEventStartDate : (date: string) => void,
        setLastEventEndDate : (date: string) => void,
        setLastEventList : (event : EVENT_TYPE[]) => void,
        setLastEventPage : (page : number) => void,
        setActiveLastEvent : (event: EVENT_TYPE | null) => void;

        setOpenPatrolList: (list: string[]) => void,
        setActiveEditPatrolCd: (cd: string) => void,
        setActiveGrp: (grp: string) => void,
        setActiveGrpSort: (sort: { cd: string, nm: string }) => void,

        setRegiPatrolNm : (nm : string) => void,
        setRegiPatrolArea : (area :{cd:string, nm : string}) => void,
        setRegiPatrolCctvList : (cctvs : CCTV_TYPE[]) => void,

        setEditPatrol : (patrol : PATROL_TYPE | null) => void;
        setEditPatrolNm : (nm : string) => void;
        setEditPatrolArea : (area :{cd:string, nm : string}) => void;
        setEditPatrolCctvList : (cctvs : CCTV_TYPE[]) => void;

        setPatrolList : (list : PATROL_TYPE[]) => void,

        setActivePatrol : (patrol : PATROL_TYPE | null) => void;
        setActivePatrolCctvList : (cctvs : CCTV_TYPE[]) => void;
        setActivePatrolCctvIndex : (index : number) => void;
        setActivePatrolFullTime : (time : {cd:string, second:number, nm : string}) => void,
        setActivePatrolPlayTime : (time : number) => void,
    }
}

export const useLeftStore = create<LeftStoreType>((set) => ({
    alarmOn: true,
    activeTab: LEFT_MENU_CAMPUS,

    activeBuildingType : LEFT_CAMPUS_WHOLE,
    activeFavorBuildingType : LEFT_CAMPUS_WHOLE,
    buildingList: [],
    favorBuildingList : [],
    activeBuilding: null,
    activeFavorBuilding: null,
    activeBuildingCctvs: [],
    activeFavorBuildingCctvs: [],

    activeCctvType : CCTV_TYPE_WHOLE,
    activeFavorCctvType : CCTV_TYPE_WHOLE,
    activeEventCctvType : CCTV_TYPE_WHOLE,
    cctvList: [],
    selectCctvList: [],
    selectFavorCctvList : [],
    editCctv: null,


    eventSearchType: EVENT_TYPE_WHOLE,
    eventSearchArea: LEFT_CAMPUS_WHOLE,
    eventSearchParam : {eventArea:'WHOLE', eventType : 'whole'},
    lastEventParam : {eventArea:'WHOLE', eventType : 'whole'},
    eventList : [],
    activeEvent: null,
    activeEventCctvs: [],

    lastEventSearchType : EVENT_TYPE_WHOLE,
    lastEventSearchArea : LEFT_CAMPUS_WHOLE,
    lastEventSearchParam : {eventArea:'WHOLE', eventType : 'whole', startDtm : DTM_DATE.start , endDtm : DTM_DATE.end},
    lastEventStartDate : DTM_DATE.start,
    lastEventEndDate : DTM_DATE.end,
    lastEventList : [],
    lastEventPage : 1,
    activeLastEvent : null,

    openPatrolList: [],
    activeEditPatrolCd: "",
    activeGrp: "",
    activeGrpSort: PATROL_SORT_RECENT,

    regiPatrolNm : "",
    regiPatrolArea : LEFT_CAMPUS_N,
    regiPatrolCctvList : [],

    editPatrol : null,
    editPatrolNm : "",
    editPatrolArea : LEFT_CAMPUS_N,
    editPatrolCctvList : [],

    patrolList : [],

    activePatrol : null,
    activePatrolCctvList : [],
    activePatrolCctvIndex : 0,
    activePatrolFullTime : PATROL_TIME_TEN_SECONDS,
    activePatrolPlayTime : 0,

    actions: {
        setAlarmOn: (on: boolean) => set({alarmOn: on}),
        setActiveTab: (tab: { cd: string, nm: string }) => set({activeTab: tab}),

        setActiveBuildingType : (type: {cd:string, nm:string}) => set({activeBuildingType: type}),
        setActiveFavorBuildingType : (type: {cd:string, nm:string}) => set({activeFavorBuildingType: type}),
        setBuildingList: (list: BUILDING_TYPE[]) => set({buildingList: list}),
        setFavorBuildingList : (list: BUILDING_TYPE[]) => set({favorBuildingList:list}),
        setActiveBuilding: (building: BUILDING_TYPE | null) => set({activeBuilding: building}),
        setActiveFavorBuilding : (building: BUILDING_TYPE | null) => set({activeFavorBuilding: building}),
        setActiveBuildingCctvs: (cctvs: CCTV_TYPE[]) => set({activeBuildingCctvs: cctvs}),
        setActiveFavorBuildingCctvs: (cctvs: CCTV_TYPE[]) => set({activeFavorBuildingCctvs: cctvs}),

        setActiveCctvType: (type: {id:string, cd: string, nm: string }) => set({activeCctvType: type}),
        setActiveFavorCctvType : (type: {id:string, cd: string, nm: string }) => set({activeFavorCctvType: type}),
        setActiveEventCctvType: (type: {id:string, cd: string, nm: string }) => set({activeEventCctvType: type}),
        setCctvList: (list: CCTV_TYPE[]) => set({cctvList: list}),
        setSelectCctvList: (list: CCTV_TYPE[]) => set({selectCctvList: list}),
        setSelectFavorCctvList : (list: CCTV_TYPE[]) => set({selectFavorCctvList: list}),
        setEditCctv: (cctv: CCTV_TYPE | null) => set({editCctv: cctv}),

        setEventSearchType: (type: { cd: string, nm: string }) => set({eventSearchType: type}),
        setEventSearchArea: (area: { cd: string, nm: string }) => set({eventSearchArea: area}),
        setEventSearchParam : (param : {eventArea : string, eventType : string} | null) => set({eventSearchParam : param}),
        setLastEventParam : (param : {eventArea : string, eventType : string} | null) => set({lastEventParam : param}),
        setEventList : (event : EVENT_TYPE[]) => set({eventList: event}),
        setActiveEvent: (event: EVENT_TYPE | null) => set({activeEvent: event}),
        setActiveEventCctvs: (cctvs: CCTV_TYPE[]) => set({activeEventCctvs: cctvs}),

        setLastEventSearchType : (type: { cd: string, nm: string }) => set({lastEventSearchType: type}),
        setLastEventSearchArea : (area: { cd: string, nm: string }) => set({lastEventSearchArea: area}),
        setLastEventSearchParam : (param : {eventArea : string, eventType : string, startDtm : string, endDtm : string} | null) => set({lastEventSearchParam : param}),
        setLastEventStartDate : (date: string) => set({lastEventStartDate: date}),
        setLastEventEndDate : (date: string) => set({lastEventEndDate: date}),
        setLastEventList : (event : EVENT_TYPE[]) => set({lastEventList: event}),
        setLastEventPage : (page : number) => set({lastEventPage : page}),
        setActiveLastEvent : (event: EVENT_TYPE | null) => set({activeLastEvent: event}),

        setOpenPatrolList: (list: string[]) => set({openPatrolList: list}),
        setActiveEditPatrolCd: (cd: string) => set({activeEditPatrolCd: cd}),
        setActiveGrp: (grp: string) => set({activeGrp: grp}),
        setActiveGrpSort: (sort: { cd: string, nm: string }) => set({activeGrpSort: sort}),

        setRegiPatrolNm : (nm : string) => set({regiPatrolNm : nm}),
        setRegiPatrolArea : (area :{cd:string, nm : string}) => set({regiPatrolArea : area}),
        setRegiPatrolCctvList : (cctvs : CCTV_TYPE[]) => set({regiPatrolCctvList : cctvs}),

        setEditPatrol : (patrol : PATROL_TYPE | null) => set({editPatrol : patrol}),
        setEditPatrolNm : (nm : string) => set({editPatrolNm : nm}),
        setEditPatrolArea : (area :{cd:string, nm : string}) => set({editPatrolArea : area}),
        setEditPatrolCctvList : (cctvs : CCTV_TYPE[]) => set({editPatrolCctvList : cctvs}),

        setPatrolList : (list : PATROL_TYPE[]) => set({patrolList : list}),

        setActivePatrol : (patrol : PATROL_TYPE | null) => set({activePatrol : patrol}),
        setActivePatrolCctvList : (cctvs : CCTV_TYPE[]) => set({activePatrolCctvList : cctvs}),
        setActivePatrolCctvIndex : (index : number) => set({activePatrolCctvIndex : index}),
        setActivePatrolFullTime : (time : {cd:string, second:number, nm : string}) => set({activePatrolFullTime : time}),
        setActivePatrolPlayTime : (time : number) => set({activePatrolPlayTime : time}),

    }
}))