import { useEffect } from "react";
import {createRoot, type Root} from "react-dom/client";
import GisWebRTCNew from "./GisWebRTCNew";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";

type TargetEl = HTMLElement & { _root?: Root };

const OverlayManager = () => {

    const cctvList = useGisStore(state => state.playList);

    useEffect(() => {
        // ⭐ cctv__in 이 DOM에 등장할 때마다 React 컴포넌트를 붙이는 함수
        const attachReactToTargets = () => {
            cctvList.forEach((cctv) => {
                const el = document.getElementById(`cctv-player-${cctv.streamId}`) as TargetEl | null;

                if (!el) return;

                // 이미 렌더링되어 있으면 중복 방지
                if (el._root) return;

                // React root 생성
                const root = createRoot(el);
                el._root = root;

                root.render(<GisWebRTCNew cctv={cctv} isFull={false} />);
            });
        };

        // ⭐ DOM 변경을 감지하는 MutationObserver
        const observer = new MutationObserver(() => {
            attachReactToTargets();
        });

        // 전체 문서를 감시 (드래그/줌 시 marker DOM이 재생성됨)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // 첫 렌더링 시에도 실행
        attachReactToTargets();

        return () => observer.disconnect();
    }, [cctvList]);

    return null;
};

export default OverlayManager;
