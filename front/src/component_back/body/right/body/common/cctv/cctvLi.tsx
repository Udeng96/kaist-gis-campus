import PlayerBox from "../player/playerBox.tsx";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";

const CctvLi = (props:{cctvs:CCTV_TYPE[]}) => {

    const activeCctvPage = useRightStore((state)=> state.activeCctvPage);
    return(
        <div className="cctv__list ct-scroll">
            <ul>
                {
                    props.cctvs !== undefined && props.cctvs.length > 0 &&
                    props.cctvs.map((cctv, idx)=>(
                        idx >= (activeCctvPage-1)*8 &&
                        idx < activeCctvPage*8 &&
                        <PlayerBox num={idx+1} cctv={cctv}/>
                    ))
                }
            </ul>
        </div>
    )
}

export default CctvLi