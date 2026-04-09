import {useEffect} from "react";
import {useFavoriteStore} from "../../store_back/zustand/favorite.ts";
import {useShallow} from "zustand/react/shallow";

export const useFavoriteSync = () => {
    const {syncFavorites} = useFavoriteStore(useShallow((state)=> ({
        syncFavorites : state.actions.syncFavorites
    })));

    useEffect(() => {
        // 일정 주기(5초)마다 동기화
        const interval = setInterval(syncFavorites, 5000);

        // 페이지 이탈 시 flush
        const handleUnload = () => syncFavorites();
        window.addEventListener("beforeunload", handleUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [syncFavorites]);
};