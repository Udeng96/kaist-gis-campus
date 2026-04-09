import { create } from "zustand/react";
import type {BuildingResponse, CctvResponse} from "../types/facTypes.ts";

interface FacServerType {
    cctvs : CctvResponse | null,
    buildings : BuildingResponse | null,

    actions:{
        setCctvs : (cctvs : CctvResponse) => void,
        setBuildings : (buildings : BuildingResponse) => void,
    }
}

export const useFacStore = create<FacServerType>((set)=>({
    cctvs : null,
    buildings : null,
    actions : {
        setCctvs : (cctvs : CctvResponse) => set({cctvs : cctvs}),
        setBuildings : (buildings : BuildingResponse) => set({buildings : buildings}),
    }
}))


