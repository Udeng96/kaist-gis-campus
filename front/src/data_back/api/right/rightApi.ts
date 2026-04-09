import axios, {type AxiosResponse} from "axios";
import type {EVENT_TYPE} from "../../interface/leftInterface.tsx";
import {RIGHT_CONTEXT} from "./rightUrl.ts";
import {LEFT_CONTEXT} from "../left/leftUrl.ts";


export const fetchPassiveRegi = async (param:EVENT_TYPE)  => {
    const {data} =  await axios.post(RIGHT_CONTEXT.PASSIVE.SAVE, param);
    return data;
}

export const fetchBuildingEvents = async (param:{buildingCd:string, startDtm : string, endDtm : string}) : Promise<AxiosResponse<EVENT_TYPE[]>> => {
    return await axios.get(LEFT_CONTEXT.EVENT.BUILDING.replace("{buildId}",param.buildingCd),{
        params : {
            startDtm : param.startDtm + "000000",
            endDtm : param.endDtm + "235959",
        }
    });
}
