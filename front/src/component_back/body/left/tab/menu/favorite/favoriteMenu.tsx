import {CCTV_TYPE_WHOLE, LEFT_CAMPUS_WHOLE} from "../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import FavorBuildingArea from "./building/favorBuildingArea.tsx";
import FavorCctvArea from "./cctv/favorCctvArea.tsx";

const FavoriteMenu = () => {
    const {
        activeFavorBuildingType,
        activeFavorCctvType
    } = useLeftStore(useShallow((state) => ({
        activeFavorBuildingType: state.activeFavorBuildingType,
        activeFavorCctvType : state.activeFavorCctvType,
    })));
    const [activeArea, setActiveArea] = useState<{ cd: string, nm: string }>(LEFT_CAMPUS_WHOLE);
    const [activeType, setActiveType] = useState<{ id: string, cd: string, nm: string }>(CCTV_TYPE_WHOLE);

    useEffect(() => {
        setActiveArea(activeFavorBuildingType);
    }, [activeFavorBuildingType]);

    useEffect(() => {
        setActiveType(activeFavorCctvType);
    }, [activeFavorCctvType]);

    return (
        <li className={`tab__item tab__item--campus active`}>
            <FavorBuildingArea activeArea={activeArea}/>
            <FavorCctvArea activeType={activeType}/>
        </li>
    )

}

export default FavoriteMenu