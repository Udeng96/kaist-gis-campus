import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import {fetchFavoriteList, syncFavorite} from "../../data_back/api/left/leftApi.ts";

interface FavoriteState {
    favorites: Set<string>; //현재 즐겨찾기된 ID들의 집합(Set)
    pendingSync: Set<string>; //서버에 아직 동기화되지 않은 ID 목록,
    buildFavorites : Set<string>;
    buildPendingSync : Set<string>;
    actions:{
        toggleFavorite: (id: string) => void;
        toggleBuildFavorite: (buildId: string) => void;
        setFavorites: (list: string[]) => void;
        setBuildFavorites: (list: string[]) => void;
        initFavorites: () => Promise<void>;
        syncFavorites: () => Promise<void>; //pendingSync에 쌓인 변경분을 서버로 전송
    }

}

export const useFavoriteStore = create<FavoriteState>()(

    // localStorage를 사용하기 때문에 사용하는 middleware
    persist(
        (set, get) => ({
            favorites: new Set(),
            pendingSync: new Set(),
            buildFavorites : new Set(),
            buildPendingSync : new Set(),

            actions:{
                setFavorites: (list: string[]) => {
                    set({ favorites: new Set(Array.isArray(list) ? list : [list]) });
                },

                setBuildFavorites: (list) => {
                    set({
                        buildFavorites: new Set(
                            Array.isArray(list) ? list : [list] // ✅ list 가 string 이어도 강제로 배열 처리
                        )
                    });
                },

                toggleBuildFavorite: (id) => {
                    const { buildFavorites, buildPendingSync } = get();
                    const newBuildFavorites = new Set(buildFavorites);
                    newBuildFavorites.has(id)
                        ? newBuildFavorites.delete(id)
                        : newBuildFavorites.add(id);

                    const newPending = new Set(buildPendingSync);
                    newPending.add(id);
                    set({ buildFavorites: newBuildFavorites, buildPendingSync: newPending });
                },

                toggleFavorite: (id) => {
                    const { favorites, pendingSync } = get();
                    const newFavorites = new Set(favorites);
                    newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
                    const newPending = new Set(pendingSync);
                    newPending.add(id);
                    set({ favorites: newFavorites, pendingSync: newPending });
                },

                syncFavorites: async () => {
                    const { pendingSync, favorites, buildPendingSync, buildFavorites } = get();
                    if (pendingSync.size === 0 && buildPendingSync.size === 0) return;

                    try {
                        await syncFavorite({
                            favorites: Array.from(favorites).join(","),
                            buildFavorites: Array.from(buildFavorites).join(","),
                        });
                        set({ pendingSync: new Set(), buildPendingSync: new Set() });
                        set({favorites: favorites, buildFavorites: buildFavorites})
                    } catch (e) {
                        console.error("즐겨찾기 동기화 실패:", e);
                    }
                },

                //서버의 초기 데이터로 로컬 상태 초기화
                initFavorites: async () => {
                    try {
                        const res = await fetchFavoriteList();
                        set({
                            favorites: new Set(res.data.favorites.split(",") || []),

                            buildFavorites: new Set(res.data.buildFavorites.split(",") || []),
                        });
                    } catch (e) {
                        console.error("즐겨찾기 초기화 실패:", e);
                    }
                },
            }
        }),

        //localStorage
        {
            name: "favorite-cache",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                favorites: Array.from(state.favorites),
                buildFavorites: Array.from(state.buildFavorites),
            }),
            merge: (persisted, current) => {
                const p = persisted as any;
                return {
                    ...current,
                    favorites: new Set<string>(p?.favorites ?? []),
                    buildFavorites: new Set<string>(p?.buildFavorites ?? []),
                } as FavoriteState;
            },
        },
    )
);