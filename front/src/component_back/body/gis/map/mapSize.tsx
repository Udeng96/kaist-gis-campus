import {useMap} from "react-leaflet";
import {useEffect} from "react";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";

const MapSize = () => {
    const map = useMap();
    const {activeLeft, activeRightMod} = useMainStore(useShallow((state) => ({
        activeLeft: state.activeLeft,
        activeRightMod: state.activeRightMod
    })));

    useEffect(() => {
        const container = map.getContainer();
        // 패널 애니메이션에 의해 실제 width가 변하는 DOM을 관찰하세요.
        // 패널 래퍼가 따로 있다면 해당 엘리먼트를 관찰하는 것이 더 정확합니다.
        const target: Element = container; // or container.parentElement!

        let rafId: number | null = null;
        const scheduleInvalidate = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                map.invalidateSize(false);
                rafId = null;
            });
        };

        // 1) 사이즈 변경을 프레임 단위로 캐치
        const ro = new ResizeObserver(() => {
            scheduleInvalidate();
        });
        ro.observe(target);

        // 2) 애니메이션이 끝났을 때 한 번 더 확정 보정
        const onTransitionEnd = () => {
            // 다음 프레임과 약간의 지연 이후 최종 보정
            requestAnimationFrame(() => {
                setTimeout(() => map.invalidateSize(false), 0);
            });
        };

        target.addEventListener("transitionend", onTransitionEnd);

        // 상태 토글 직후에도 바로 한 번(시작 보정)
        requestAnimationFrame(() => map.invalidateSize(false));

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            ro.disconnect();
            target.removeEventListener("transitionend", onTransitionEnd);
        };
    }, [map, activeLeft, activeRightMod]);

    return null;
};
export default MapSize