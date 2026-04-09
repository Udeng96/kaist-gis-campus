import { create } from "zustand/react";
import type { BuildingType, CctvType } from "../api/types/fac";

interface FavoriteStoreType {
    activeBuilding: BuildingType | null;
    selectedCctvs: CctvType[];
    highlightCctvs: CctvType[];

    actions: {
        setActiveBuilding: (v: BuildingType | null) => void;
        setSelectedCctvs: (v: CctvType[]) => void;
        toggleSelectedCctv: (cctv: CctvType) => void;
        setHighlightCctvs: (v: CctvType[]) => void;
    };
}

export const useFavoriteStore = create<FavoriteStoreType>((set) => ({
    activeBuilding: null,
    selectedCctvs: [],
    highlightCctvs: [],
    actions: {
        setActiveBuilding: (v) => set({ activeBuilding: v }),
        setSelectedCctvs: (v) => set({ selectedCctvs: v }),
        toggleSelectedCctv: (cctv) => set((state) => {
            const exists = state.selectedCctvs.some((c) => c.facInfo.facId === cctv.facInfo.facId);
            return {
                selectedCctvs: exists
                    ? state.selectedCctvs.filter((c) => c.facInfo.facId !== cctv.facInfo.facId)
                    : [...state.selectedCctvs, cctv],
            };
        }),
        setHighlightCctvs: (v) => set({ highlightCctvs: v }),
    },
}));
