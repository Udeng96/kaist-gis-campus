import Campus from "./campus/campus.tsx";
import {useQuery} from "@tanstack/react-query";
import {getHttp} from "../../../../../api/commonApi.ts";
import {BASE_URL, END_POINT} from "../../../../../config/url.ts";
import {useEffect} from "react";
import {useFacStore} from "../../../../../api/data/fac.ts";
import {useShallow} from "zustand/react/shallow";
import type {FacResponse} from "../../../../../api/types/facTypes.ts";
import {useCommonClientStore} from "../../../../../data/common.ts";

const TabBody = () => {

    const activeLeftMenu = useCommonClientStore().activeLeftMenu;
    const {setCctvs, setBuildings} = useFacStore(useShallow((state)=> ({
        setCctvs : state.actions.setCctvs,
        setBuildings : state.actions.setBuildings
    })))

    const {data: facilities} = useQuery({
        queryKey: ["facilites",],
        queryFn: () => getHttp<FacResponse>(BASE_URL + END_POINT.FAC.ALL, {}),
        staleTime: Infinity,
    })

    useEffect(() => {
        if(facilities){
            setCctvs(facilities.cctv);
            setBuildings(facilities.building);
        }
    }, [facilities]);


    return(
        <div className="content__body">
            <ul>
                {
                    activeLeftMenu === 'CAMPUS' && <Campus/>
                }
            </ul>
        </div>
    )
}

export default TabBody