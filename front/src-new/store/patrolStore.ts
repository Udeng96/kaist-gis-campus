import { create } from 'zustand/react';
import type { PatrolType, PatrolCctvType } from '@api/types/patrol';

interface PatrolStoreType {
    isPatrolMode: boolean;
    patrolList: PatrolType[];

    // 재생 상태
    activePatrol: PatrolType | null;
    isPlaying: boolean;
    currentCctvIndex: number;
    playDuration: number;  // CCTV당 재생 시간 (초)
    playElapsed: number;   // 현재 경과 시간 (초)

    // 등록/수정
    isEditing: boolean;
    editingPatrol: PatrolType | null;  // null이면 신규 등록
    editName: string;
    editCctvs: PatrolCctvType[];

    actions: {
        setPatrolMode: (on: boolean) => void;
        setPatrolList: (list: PatrolType[]) => void;

        // 재생
        playPatrol: (patrol: PatrolType) => void;
        stopPatrol: () => void;
        nextCctv: () => void;
        prevCctv: () => void;
        setPlayDuration: (sec: number) => void;
        setPlayElapsed: (sec: number) => void;
        resetPlayElapsed: () => void;

        // 등록/수정
        openEditForm: (patrol: PatrolType | null) => void;
        closeEditForm: () => void;
        setEditName: (name: string) => void;
        addEditCctv: (cctv: PatrolCctvType) => void;
        removeEditCctv: (index: number) => void;
        clearEditCctvs: () => void;
        reorderEditCctvs: (from: number, to: number) => void;
    };
}

export const usePatrolStore = create<PatrolStoreType>((set, get) => ({
    isPatrolMode: false,
    patrolList: [],

    activePatrol: null,
    isPlaying: false,
    currentCctvIndex: 0,
    playDuration: 30,
    playElapsed: 0,

    isEditing: false,
    editingPatrol: null,
    editName: '',
    editCctvs: [],

    actions: {
        setPatrolMode: (on) => set({
            isPatrolMode: on,
            // 순찰모드 끄면 재생/편집도 초기화
            ...(!on && {
                activePatrol: null,
                isPlaying: false,
                currentCctvIndex: 0,
                playElapsed: 0,
                isEditing: false,
                editingPatrol: null,
            }),
        }),
        setPatrolList: (list) => set({ patrolList: list }),

        playPatrol: (patrol) => set({
            activePatrol: patrol,
            isPlaying: true,
            currentCctvIndex: 0,
            playElapsed: 0,
        }),
        stopPatrol: () => set({
            activePatrol: null,
            isPlaying: false,
            currentCctvIndex: 0,
            playElapsed: 0,
        }),
        nextCctv: () => {
            const { activePatrol, currentCctvIndex } = get();
            if (!activePatrol) return;
            const len = activePatrol.cctvMapps.length;
            set({
                currentCctvIndex: (currentCctvIndex + 1) % len,
                playElapsed: 0,
            });
        },
        prevCctv: () => {
            const { activePatrol, currentCctvIndex } = get();
            if (!activePatrol) return;
            const len = activePatrol.cctvMapps.length;
            set({
                currentCctvIndex: (currentCctvIndex - 1 + len) % len,
                playElapsed: 0,
            });
        },
        setPlayDuration: (sec) => set({ playDuration: sec }),
        setPlayElapsed: (sec) => set({ playElapsed: sec }),
        resetPlayElapsed: () => set({ playElapsed: 0 }),

        openEditForm: (patrol) => set({
            isEditing: true,
            editingPatrol: patrol,
            editName: patrol?.name ?? '',
            editCctvs: patrol?.cctvMapps ?? [],
        }),
        closeEditForm: () => set({
            isEditing: false,
            editingPatrol: null,
            editName: '',
            editCctvs: [],
        }),
        setEditName: (name) => set({ editName: name }),
        addEditCctv: (cctv) => {
            const { editCctvs } = get();
            // 중복 방지
            const exists = editCctvs.some(
                (c) => c.cctvInfo.facInfo.facId === cctv.cctvInfo.facInfo.facId
            );
            if (!exists) {
                set({ editCctvs: [...editCctvs, { ...cctv, order: editCctvs.length }] });
            }
        },
        removeEditCctv: (index) => {
            const { editCctvs } = get();
            const updated = editCctvs.filter((_, i) => i !== index)
                .map((c, i) => ({ ...c, order: i }));
            set({ editCctvs: updated });
        },
        clearEditCctvs: () => set({ editCctvs: [] }),
        reorderEditCctvs: (from, to) => {
            const { editCctvs } = get();
            const arr = [...editCctvs];
            const [removed] = arr.splice(from, 1);
            arr.splice(to, 0, removed);
            set({ editCctvs: arr.map((c, i) => ({ ...c, order: i })) });
        },
    },
}));
