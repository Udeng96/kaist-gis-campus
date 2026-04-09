import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";

const GisToast = () => {

    const {isCastMode} = useGisStore(useShallow((state)=> ({
        isCastMode : state.isCastMode,
    })))
    return(
        <>
            {
                isCastMode&&
                <div className="toast-tooltip">지도에서 CCTV를 선택하면 우측 패널에 추가됩니다.</div>
            }
        </>
    )
}

export default GisToast;