import {create} from "zustand/react";
import type {BuildingType, CctvType} from "@api/types/fac";

interface CampusType {
    activeBuilding: BuildingType | null;
    activeCctv: CctvType | null;
    selectedCctvs: CctvType[];       // 다중 선택된 CCTV 목록
    highlightCctvs: CctvType[];      // 건물 선택 시 해당 건물의 CCTV
    rightTab: string;
    rightCctvPage: number;
    scrollTargetId: string | null;   // 지도 마커 클릭 시 리스트 스크롤 대상
    cctvTypeFilter: string;          // 'whole' | 'IN' | 'OUT' | 'FLAME'
    buildingAreaFilter: string;      // 'whole' | 'W' | 'E' | 'N'
    showBuildingMarkers: boolean;    // 건물 마커 표출
    showCctvMarkers: boolean;        // CCTV 마커 표출
    cctvFormMode: 'NONE' | 'CREATE' | 'EDIT';  // CCTV 등록/수정 모드
    editCctv: CctvType | null;                   // 수정 대상 CCTV

    actions: {
        setActiveBuilding: (v: BuildingType | null) => void;
        setActiveCctv: (v: CctvType | null) => void;
        setSelectedCctvs: (v: CctvType[]) => void;
        toggleSelectedCctv: (cctv: CctvType) => void;
        removeSelectedCctv: (facId: string) => void;
        setHighlightCctvs: (v: CctvType[]) => void;
        setRightTab: (v: string) => void;
        setRightCctvPage: (v: number) => void;
        setScrollTargetId: (v: string | null) => void;
        setCctvTypeFilter: (v: string) => void;
        setBuildingAreaFilter: (v: string) => void;
        toggleBuildingMarkers: () => void;
        toggleCctvMarkers: () => void;
        setCctvFormMode: (v: 'NONE' | 'CREATE' | 'EDIT') => void;
        setEditCctv: (v: CctvType | null) => void;
        openCctvCreate: () => void;
        openCctvEdit: (cctv: CctvType) => void;
        closeCctvForm: () => void;
    };
}

export const useCampusStore = create<CampusType>((set) => ({
    activeBuilding: null,
    activeCctv: null,
    selectedCctvs: [],
    highlightCctvs: [],
    rightTab: 'CCTV',
    rightCctvPage: 1,
    scrollTargetId: null,
    cctvTypeFilter: 'whole',
    buildingAreaFilter: 'whole',
    showBuildingMarkers: true,
    showCctvMarkers: true,
    cctvFormMode: 'NONE',
    editCctv: null,
    actions: {
        setActiveBuilding: (v) => set({ activeBuilding: v }),
        setActiveCctv: (v) => set({ activeCctv: v }),
        setSelectedCctvs: (v) => set({ selectedCctvs: v }),
        toggleSelectedCctv: (cctv) => set((state) => {
            const exists = state.selectedCctvs.some((c) => c.facInfo.facId === cctv.facInfo.facId);
            return {
                selectedCctvs: exists
                    ? state.selectedCctvs.filter((c) => c.facInfo.facId !== cctv.facInfo.facId)
                    : [...state.selectedCctvs, cctv],
            };
        }),
        removeSelectedCctv: (facId) => set((state) => ({
            selectedCctvs: state.selectedCctvs.filter((c) => c.facInfo.facId !== facId),
        })),
        setHighlightCctvs: (v) => set({ highlightCctvs: v }),
        setRightTab: (v) => set({ rightTab: v }),
        setRightCctvPage: (v) => set({ rightCctvPage: v }),
        setScrollTargetId: (v) => set({ scrollTargetId: v }),
        setCctvTypeFilter: (v) => set({ cctvTypeFilter: v }),
        setBuildingAreaFilter: (v) => set({ buildingAreaFilter: v }),
        toggleBuildingMarkers: () => set((s) => ({ showBuildingMarkers: !s.showBuildingMarkers })),
        toggleCctvMarkers: () => set((s) => ({ showCctvMarkers: !s.showCctvMarkers })),
        setCctvFormMode: (v) => set({ cctvFormMode: v }),
        setEditCctv: (v) => set({ editCctv: v }),
        openCctvCreate: () => set({ cctvFormMode: 'CREATE', editCctv: null }),
        openCctvEdit: (cctv) => set({ cctvFormMode: 'EDIT', editCctv: cctv }),
        closeCctvForm: () => set({ cctvFormMode: 'NONE', editCctv: null }),
    },
}));
