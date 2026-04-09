import axios, {type AxiosResponse} from "axios";
import {COMMON_CONTEXT} from "./commonUrl.ts";
import type {ReportType, SensorResponse, WeatherType} from "../../interface/ccomonInterface.ts";

export const fetchCCTVCodec = async (params:{cctvId: string}) : Promise<AxiosResponse<{Type:string}[]>> => {
    const {data} = await axios.get(COMMON_CONTEXT.WEB_RTC.CODEC+params.cctvId);
    return data;
}

export const connectWebRTCPlayer = async (params:{cctvId: string, data: string}) => {
    const {data} = await axios.post(COMMON_CONTEXT.WEB_RTC.REMOTE_SDP,{
        suuid : params.cctvId,
        data : params.data
    });
    return data;
}

export const fetchSensros = async () : Promise<AxiosResponse<SensorResponse>> => {
    return await axios.get(COMMON_CONTEXT.SENSOR.LIST);
}

export const fetchWeathers = async () : Promise<AxiosResponse<WeatherType>> => {
    return await axios.get(COMMON_CONTEXT.WEATHER.INFO)
}

export const fetchReports = async () : Promise<AxiosResponse<ReportType>> => {
    return await axios.get(COMMON_CONTEXT.WEATHER.REPORT)
}