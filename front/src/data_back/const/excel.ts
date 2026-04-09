import type {BUILDING_TYPE} from "../interface/leftInterface.tsx";
import type {SensorResponse} from "../interface/ccomonInterface.ts";
import moment from "moment/moment";

export const headerList = ["", "이벤트 타입", "발생 건물", "건물 이름", "센서 명", "발생 날짜", "종료 날짜"];


export const HEADER_STYLE = {
    font: {
        bold: true,
        sz: '13'
    },
    alignment: {
        horizontal: "center",
        vertical: "center",
    },
    border: {
        top: {style: "thin", color: {rgb: "000000"}},
        bottom: {style: "thin", color: {rgb: "000000"}},
        left: {style: "thin", color: {rgb: "000000"}},
        right: {style: "thin", color: {rgb: "000000"}}
    }
}

export const BODT_STYLE = {
    font: {
        bold: false,
        sz: '10'
    },
    alignment: {
        horizontal: "center",
        vertical: "center",
    }
}

export const TITLE_STYLE = {
    font: {
        bold: true,
        sz: '17'
    },
    alignment: {
        horizontal: "center",
        vertical: "center",
    }
}

export const setHeader = (nm: string, type: string) => {
    return {
        v: nm,
        t: type,
        s: {...HEADER_STYLE}
    }
}

export const setBody = (nm: string, type: string): {
    s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
    t: string,
    v: string
} => {
    return {
        v: nm,
        t: type,
        s: {...BODT_STYLE}
    }
}
export const header = headerList.map((headerItem) => setHeader(headerItem, "s"));

export const setEventTypeNm = (type: string) => {
    if (type.includes("gas")) {
        return "가스 " + type.replace("gas0", "").replace("3", "1") + "단계"
    } else if (type.includes("fire")) {
        return "화재"
    } else if (type.includes("flame")) {
        return "불꽃 감지"
    }
    return ""
}

export const setBuildingNm = (buildingList: BUILDING_TYPE[], buildingCd: string) => {
    const filterBuilding = buildingList.filter((item) => item.id === buildingCd);
    return filterBuilding.length > 0 ? filterBuilding[0].name : '';
}

export const setSensorNm = (type: string, sensorList : SensorResponse | null, sensorId: string) => {
    if (sensorList) {
        if (type.includes("gas")) {
            const sensors = sensorList.gasSensors;
            const filterSensor = sensors.filter((item) => item.cd === sensorId);
            return filterSensor.length > 0 ? filterSensor[0].nm : '';
        } else if (type.includes("fire")) {
            const sensors = sensorList.fireSensors;
            const filterSensor = sensors.filter((item) => item.cd === sensorId);
            return filterSensor.length > 0 ? filterSensor[0].nm : '';
        } else if (type.includes("flame")) {
            const sensors = sensorList.flameSensors;
            const filterSensor = sensors.filter((item) => item.cd === sensorId);
            return filterSensor.length > 0 ? filterSensor[0].nm : '';
        } else {
            return "";
        }
    } else {
        return "";
    }
}

export const setDtmForm = (dtm : string) =>{
    if(dtm !== ""){
        return moment(dtm, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss")
    }else{
        return "";
    }
}
