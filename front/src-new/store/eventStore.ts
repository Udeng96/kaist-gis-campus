import { create } from "zustand/react";
import type { EventResponse, EventType } from "../api/types/event";
import type { CctvType } from "../api/types/fac";

interface EventStoreType {
    events: EventResponse | null;
    campusBuildingEvents: EventResponse | null;
    activeEvent: EventType | null;
    isCastMode: boolean;             // 수동 투망 모드
    castCctvs: CctvType[];           // 수동 투망으로 추가된 CCTV
    passiveFormOpen: boolean;        // 수동 이벤트 등록 폼

    // 임시 필터 (UI 선택용)
    tempArea: string;
    tempType: string;

    // 확정 필터 (API 요청용 - 조회 버튼 클릭 시 반영)
    filterArea: string;
    filterType: string;

    actions: {
        setEvents: (v: EventResponse | null) => void;
        setCampusBuildingEvents: (v: EventResponse | null) => void;
        setActiveEvent: (v: EventType | null) => void;
        setTempArea: (v: string) => void;
        setTempType: (v: string) => void;
        applyFilter: () => void;
        resetFilter: () => void;
        toggleCastMode: () => void;
        addCastCctv: (cctv: CctvType) => void;
        clearCast: () => void;
        setPassiveFormOpen: (v: boolean) => void;
    };
}

export const useEventStore = create<EventStoreType>((set) => ({
    events: null,
    campusBuildingEvents: null,
    activeEvent: null,
    isCastMode: false,
    castCctvs: [],
    passiveFormOpen: false,
    tempArea: 'all',
    tempType: 'all',
    filterArea: 'all',
    filterType: 'all',
    actions: {
        setEvents: (v) => set({ events: v }),
        setCampusBuildingEvents: (v) => set({ campusBuildingEvents: v }),
        setActiveEvent: (v) => set({ activeEvent: v, isCastMode: false, castCctvs: [] }),
        setTempArea: (v) => set({ tempArea: v }),
        setTempType: (v) => set({ tempType: v }),
        applyFilter: () => set((s) => ({ filterArea: s.tempArea, filterType: s.tempType })),
        resetFilter: () => set({ tempArea: 'all', tempType: 'all' }),
        toggleCastMode: () => set((s) => ({ isCastMode: !s.isCastMode, castCctvs: s.isCastMode ? [] : s.castCctvs })),
        addCastCctv: (cctv) => set((s) => {
            const exists = s.castCctvs.some((c) => c.facInfo.facId === cctv.facInfo.facId);
            if (exists) return { castCctvs: s.castCctvs.filter((c) => c.facInfo.facId !== cctv.facInfo.facId) };
            return { castCctvs: [...s.castCctvs, cctv] };
        }),
        clearCast: () => set({ isCastMode: false, castCctvs: [] }),
        setPassiveFormOpen: (v) => set({ passiveFormOpen: v, activeEvent: null, isCastMode: false, castCctvs: [] }),
    },
}));
