import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import FavorCctvItem from "./favorCctvItem.tsx";

const FavorCctvs = ({activeType, cctvs}: {
    activeType: { id: string, cd: string, nm: string },
    cctvs: CCTV_TYPE[]
}) => {
    const activeFavorBuildingCctvs = useLeftStore(state=> state.activeFavorBuildingCctvs)
    const [activeCctvs, setActiveCctvs] = useState<CCTV_TYPE[]>([])

    useEffect(() => {
            if (activeFavorBuildingCctvs.length > 0) {
                const priority = activeFavorBuildingCctvs.map((c) => c.streamId);


                const sortedCctvList = [...cctvs].sort((a, b) => {
                    const aIndex = priority.indexOf(a.streamId);
                    const bIndex = priority.indexOf(b.streamId);

                    // priority에 없는 streamId는 indexOf → -1 된다

                    if (aIndex === -1 && bIndex === -1) return 0; // 둘 다 우선순위 없음 → 원래 순서 유지
                    if (aIndex === -1) return 1; // a는 없고 b는 있음 → b가 앞으로
                    if (bIndex === -1) return -1; // b는 없고 a는 있음 → a가 앞으로

                    return aIndex - bIndex; // 둘 다 우선순위에 있다면 priority 순서대로 정렬
                });

                setActiveCctvs(sortedCctvList);
            } else {
                setActiveCctvs([...cctvs])
            }

        }, [cctvs, activeFavorBuildingCctvs]
    )

    return (
        <div className={`list__body`}>
            <ul className="ct-scroll">
                {
                    activeCctvs.filter((cctv) => activeType.id === '0' || cctv.plcType === activeType.id).map((cctv, idx) => (
                        <FavorCctvItem cctv={cctv} idx={idx}/>
                    ))
                }
            </ul>
        </div>
    )

}

export default FavorCctvs