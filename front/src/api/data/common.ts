import {create} from "zustand/react";
import type {MetaType} from "../types/commonTypes.ts";

interface CommonServerType {
    leftTab: MetaType[],
    cctvType: MetaType[],
    sensorType: MetaType[],
    campusType: MetaType[],
    eventType: MetaType[],

    actions: {
        setLeftTab: (leftTab: MetaType[]) => void,
        setCctvType: (cctvType: MetaType[]) => void,
        setSensorType: (sensorType: MetaType[]) => void,
        setCampusType: (campusArea: MetaType[]) => void,
        setEventType: (eventType: MetaType[]) => void,
    }
}

export const useCommonStore = create<CommonServerType>((set) => ({
        leftTab: [],
        cctvType: [],
        sensorType: [],
        campusType: [],
        eventType: [],
        actions: {
            setLeftTab: (leftTab: MetaType[]) => set({leftTab: leftTab}),
            setCctvType: (cctvType: MetaType[]) => set({cctvType: cctvType}),
            setSensorType: (sensorType: MetaType[]) => set({sensorType: sensorType}),
            setCampusType: (campusType: MetaType[]) => set({campusType: campusType}),
            setEventType: (eventType: MetaType[]) => set({eventType: eventType}),
        }
    }
))