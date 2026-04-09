import { create } from "zustand/react";
import type { BuildingResponse, CctvResponse } from "../api/types/fac";
import { putHttp } from "../api/http";
import { BASE_URL, END_POINT } from "../api/url";

interface FacServerType {
    cctvs: CctvResponse | null;
    buildings: BuildingResponse | null;

    actions: {
        setCctvs: (cctvs: CctvResponse) => void;
        setBuildings: (buildings: BuildingResponse) => void;
        toggleBuildingFavorite: (facId: string) => void;
        toggleCctvFavorite: (facId: string) => void;
    };
}

export const useFacStore = create<FacServerType>((set) => ({
    cctvs: null,
    buildings: null,
    actions: {
        setCctvs: (cctvs: CctvResponse) => set({ cctvs }),
        setBuildings: (buildings: BuildingResponse) => set({ buildings }),
        toggleBuildingFavorite: (facId) => {
            // API 호출
            putHttp(`${BASE_URL}${END_POINT.FAC.FAV_BUILDING}/${facId}`, {}).catch(console.error);
            // 낙관적 업데이트
            set((s) => {
                if (!s.buildings) return {};
                return {
                    buildings: {
                        ...s.buildings,
                        buildingItems: s.buildings.buildingItems.map((b) =>
                            b.facInfo.facId === facId
                                ? { ...b, facInfo: { ...b.facInfo, isFavorite: !b.facInfo.isFavorite } }
                                : b
                        ),
                    },
                };
            });
        },
        toggleCctvFavorite: (facId) => {
            // API 호출
            putHttp(`${BASE_URL}${END_POINT.FAC.FAV_CCTV}/${facId}`, {}).catch(console.error);
            // 낙관적 업데이트
            set((s) => {
                if (!s.cctvs) return {};
                return {
                    cctvs: {
                        ...s.cctvs,
                        cctvItems: s.cctvs.cctvItems.map((c) =>
                            c.facInfo.facId === facId
                                ? { ...c, facInfo: { ...c.facInfo, isFavorite: !c.facInfo.isFavorite } }
                                : c
                        ),
                    },
                };
            });
        },
    },
}));
