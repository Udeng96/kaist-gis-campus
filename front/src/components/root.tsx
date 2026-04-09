import "../assets/common/css/common.css";
import "../assets/common/css/header.css";
import "../assets/common/css/onboarding.css";

import "../assets/dashboard/css/main.css";
import "../assets/common/css/content.css";
import "../assets/common/css/gis.css";
import "../assets/dashboard/css/event.css";
import "../assets/common/css/patrol.css";

import "../assets/common/css/modal.css";

import "../assets/common/css/datePicker.css";
import "../assets/common/css/selectBox.css";
import "../assets/common/css/toggleBtn.css";
import "../assets/common/css/tree.css";


import Logo from "./topbar/logo.tsx";
import Info from "./topbar/info.tsx";
import LeftPanel from "./main/panel/left/leftPanel.tsx";
import Gis from "./main/gis/gis.tsx";
import {useQuery} from "@tanstack/react-query";
import {getHttp} from "../api/commonApi.ts";
import type {MetaType} from "../api/types/commonTypes.ts";
import {BASE_URL, END_POINT} from "../config/url.ts";
import {useEffect} from "react";
import { useCommonStore } from "../api/data/common.ts";
import {useShallow} from "zustand/react/shallow";
import {META_KEY} from "../config/const.ts";
import RightPanel from "./main/panel/right/rightPanel.tsx";


const Root = () => {

    const {setLeftTab,setCctvType,setSensorType,setCampusType,setEventType} = useCommonStore(useShallow((state)=> ({
        setLeftTab : state.actions.setLeftTab,
        setCctvType : state.actions.setCctvType,
        setSensorType : state.actions.setSensorType,
        setCampusType : state.actions.setCampusType,
        setEventType : state.actions.setEventType,
    })))

    const {data: metaType} = useQuery({
        queryKey: ["meta"],
        queryFn: () => getHttp<MetaType[]>(BASE_URL + END_POINT.COMMON.META_DATA, {}),
        staleTime : 1000*60*10
    })

    useEffect(() => {
        if(metaType){
            setLeftTab(metaType.filter(type => type.type === META_KEY.LEFT_TAB_TYPE));
            setCctvType(metaType.filter(type => type.type === META_KEY.CCTV_TYPE));
            setSensorType(metaType.filter(type => type.type === META_KEY.FAC));
            setCampusType(metaType.filter(type=> type.type === META_KEY.CAMPUS_AREA));
            setEventType(metaType.filter(type=> type.type === META_KEY.EVENT));
        }
    }, [metaType]);

    return(
        <div className={"wrap"}>
            <header id="header" className="header">
                <Logo/>
                <Info/>
                <button type="button" className="btn-onboarding">사용가이드</button>
            </header>
            <main>
                <LeftPanel/>
                <Gis/>
                <RightPanel/>
            </main>
        </div>
    )
}

export default Root