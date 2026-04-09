import axios, {type AxiosResponse} from "axios";
import {LEFT_CONTEXT} from "./leftUrl.ts";
import type {BUILDING_TYPE, CCTV_TYPE, EVENT_TYPE, PATROL_TYPE} from "../../interface/leftInterface.tsx";
import {EVENT_TYPE_WHOLE, LEFT_CAMPUS_WHOLE} from "../../const/common.ts";

export const fetchBuildings = async () : Promise<AxiosResponse<BUILDING_TYPE[]>> => {
    return await axios.get(LEFT_CONTEXT.BUILDING);
}

export const fetchCctvs = async () : Promise<AxiosResponse<CCTV_TYPE[]>> => {
    return await axios.get(LEFT_CONTEXT.CCTV.LIST);
}

export const fetchCctvRegi = async (param:CCTV_TYPE)  => {
    const {data} =  await axios.post(LEFT_CONTEXT.CCTV.REGI, param);
    return data;
}

export const editCctvInfo = async (param:CCTV_TYPE) => {
    const {data} = await axios.put(LEFT_CONTEXT.CCTV.EDIT, param);
    return data;
}
export const delCctvInfo = async (param: {streamId:string}) => {
    const {data} = await axios.delete(LEFT_CONTEXT.CCTV.DEL.replace("{streamId}", param.streamId));
    return data;
}

export const fetchFavoriteList = async () : Promise<AxiosResponse<{favorites:string, buildFavorites:string}>> => {
    return await axios.get(LEFT_CONTEXT.FAVORITE.LIST);
}

export const syncFavorite = async (param : {favorites:string, buildFavorites:string}) => {
    const {data} = await  axios.put(LEFT_CONTEXT.FAVORITE.SYNC, param);
    return data;
}

export const fetchEvents = async (param:{eventArea:string, eventType:string}) : Promise<AxiosResponse<EVENT_TYPE[]>> => {
    return await axios.get(LEFT_CONTEXT.EVENT.MAIN,{
        params : {
            eventArea : param.eventArea === LEFT_CAMPUS_WHOLE.cd ? "" : param.eventArea,
            eventType : param.eventType === EVENT_TYPE_WHOLE.cd ? "" : param.eventType
        }
    });
}

export const fetchLastEvents = async (param:{eventArea : string, eventType : string, startDtm : string, endDtm : string}) : Promise<AxiosResponse<EVENT_TYPE[]>> => {
    return await axios.get(LEFT_CONTEXT.EVENT.LAST,{
        params : {
            startDtm : param.startDtm + "000000",
            endDtm : param.endDtm + "235959",
            eventArea : param.eventArea === LEFT_CAMPUS_WHOLE.cd ? "" : param.eventArea,
            eventType : param.eventType === EVENT_TYPE_WHOLE.cd ? "" : param.eventType
        }
    });
}

export const clearEvent = async (param:{seqn:string, clrDtm:string}) => {
    const {data} = await axios.put(LEFT_CONTEXT.EVENT.CLEAR.replace("{seqn}",param.seqn),{},{
        params : {
            clrDtm : param.clrDtm
        }
    });
    return {data:data, message:param.clrDtm};
}
export const fetchPatrols = async () : Promise<AxiosResponse<PATROL_TYPE[]>> => {
    return await axios.get(LEFT_CONTEXT.PATROL.LIST);
}

export const fetchPatrolRegi = async (param:PATROL_TYPE)  => {
    const {data} =  await axios.post(LEFT_CONTEXT.PATROL.REGI, param);
    return data;
}

export const fetchPatrolEdit = async (param:PATROL_TYPE)  => {
    const {data} =  await axios.put(LEFT_CONTEXT.PATROL.EDIT, param);
    return data;
}

export const fetchPatrolDelete = async (id:string) => {
    const {data} =  await axios.delete(LEFT_CONTEXT.PATROL.DELETE.replace("{id}", id));
    return data;
}

