import {CCTV_TYPE_WHOLE, LEFT_CAMPUS_WHOLE} from "../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import BuildingArea from "./building/buildingArea.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchBuildings, fetchCctvs} from "../../../../../../data_back/api/left/leftApi.ts";
import CctvArea from "./cctv/cctvArea.tsx";

const CampusMenu = () => {
    const {
        activeBuildingType,
        activeCctvType,
        setBuildingList,
        setCctvList
    } = useLeftStore(useShallow((state) => ({
        activeBuildingType: state.activeBuildingType,
        activeCctvType: state.activeCctvType,
        setBuildingList: state.actions.setBuildingList,
        setCctvList: state.actions.setCctvList

    })));
    const [activeArea, setActiveArea] = useState<{ cd: string, nm: string }>(LEFT_CAMPUS_WHOLE);
    const [activeType, setActivType] = useState<{ id: string, cd: string, nm: string }>(CCTV_TYPE_WHOLE);

    const {data: buildingRes} = useQuery({
        queryKey: ['buildingList'],
        queryFn: () => fetchBuildings(),
        staleTime: Infinity
    })

    const {data: cctvRes} = useQuery({
        queryKey: ['cctvList'],
        queryFn: () => fetchCctvs(),
        staleTime: Infinity
    })

    useEffect(() => {
        if (buildingRes) {
            if (buildingRes.data) {
                setBuildingList(buildingRes.data);
            }
        }
    }, [buildingRes]);

    useEffect(() => {
        if (cctvRes) {
            if (cctvRes.data) {
                setCctvList(cctvRes.data.filter((cctv) => !cctv.streamId.includes("HIGH")));
            }
        }
    }, [cctvRes]);


    useEffect(() => {
        setActiveArea(activeBuildingType);
        setActivType(activeCctvType);
    }, [activeBuildingType, activeCctvType]);

    return (
        <li className={`tab__item tab__item--campus active`}>
            <BuildingArea activeArea={activeArea}/>
            <CctvArea activeType={activeType} />
        </li>
    )
}

export default CampusMenu
