import {create} from "zustand/react";
import type {EventResponse} from "../types/eventTypes.ts";

interface EventServerType {
    campusBuildingEvents : EventResponse | null,

    actions:{
        setCampusBuildingEvents : (event : EventResponse | null) => void,
    }
}

export const useEventStore = create<EventServerType>((set)=>({
    campusBuildingEvents : null,
    actions : {
        setCampusBuildingEvents : (event : EventResponse | null) => set({campusBuildingEvents : event}),
    }
}))


