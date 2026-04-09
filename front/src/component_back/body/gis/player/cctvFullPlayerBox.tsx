import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";
import WebRTCNew from "./WebRTCNew.tsx";

const CctvFullPlayerBox = () => {


    const {activeFullCctv, setActiveFullCctv}= useGisStore(useShallow((state)=> ({
        activeFullCctv : state.activeFullCctv,
        setActiveFullCctv : state.actions.setActiveFullCctv
    })));

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setActiveFullCctv(null); // ESC 눌렀을 때 실행할 동작
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);


    return (
        <div id="modal-cctv" className={`modal cctv activeFullCctv ${activeFullCctv !== null ? '' : 'hidden'}`} style={{zIndex:'1005'}}>
            <div className="cctv__head">
                <h2 className="cctv__title">{activeFullCctv ? activeFullCctv.cctvNm : ''}</h2>
                <button className="btn-close modal-close" onClick={()=> setActiveFullCctv(null)}></button>
            </div>
            <div className="cctv__body">
                <div className="cctv__in">
                    {
                        activeFullCctv &&
                        <WebRTCNew cctvId={activeFullCctv.streamId + "_HIGH"}/>
                    }
                </div>
                <button type="button" className="btn-minimize" onClick={()=> setActiveFullCctv(null)}></button>
            </div>
            <div className="toast-tooltip">화면을 종료하려면 [ESC] 키를 눌러주세요.</div>
        </div>
    )

}

export default CctvFullPlayerBox