import {isDev} from "../../const/common.ts";

export const MAIN_IP  = isDev ? 'http://localhost:22410' : '';

export const COMMON_CONTEXT = {
    WEB_RTC:{
        CODEC: '/stream/codec/',
        REMOTE_SDP: `/stream/receiver`,
    },

    WEB_SOCKET:{
        FIRE: isDev ? 'http://localhost:8091/ws/fire' : '/ws/fire',
        GAS:  isDev ? 'http://localhost:22411/ws/gas': '/ws/gas',
        FLAME: isDev? 'http://localhost:8089/ws/flame' :'/ws/flame'
    },

    SENSOR : {
        LIST : MAIN_IP+'/kaist/fac/sensors'
    },

    WEATHER : {
        INFO : MAIN_IP+'/kaist/weather/info',
        REPORT : MAIN_IP+'/kaist/report/info'
    }



}