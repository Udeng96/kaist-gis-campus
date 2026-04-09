import {create} from "zustand/react";
import type {BuildingType, CctvType} from "../api/types/facTypes.ts";

interface CampusType {

    activeBuilding : BuildingType | null,
    activeCctv : CctvType | null,
    highlightCctvs : CctvType[],
    rightTab : string,
    rightCctvPage : number,

    actions:{
        setActiveBuilding : (activeBuilding : BuildingType | null) => void,
        setActiveCctv : (activeCctv : CctvType | null) => void,
        setHighlightCctvs : (highlightCctvs : CctvType[])=> void,
        setRightTab : (rightTab:string) => void,
        setRightCctvPage : (rightCctvPage : number) => void,

    }
}

export const useCampusStore = create<CampusType>((set)=>({
    activeBuilding : null,
    activeCctv : null,
    highlightCctvs : [],
    rightTab : 'CCTV',
    rightCctvPage : 1,
    actions : {
        setActiveBuilding : (activeBuilding: BuildingType | null) => set({activeBuilding: activeBuilding}),
        setActiveCctv : (activeCctv : CctvType | null) => set({activeCctv : activeCctv}),
        setHighlightCctvs : (highlightCctvs:CctvType[]) => set({highlightCctvs : highlightCctvs}),
        setRightTab : (rightTab :string) => set({rightTab : rightTab}),
        setRightCctvPage : (rightCctvPage:number) => set({rightCctvPage : rightCctvPage}),
    }
}))


