import RightTab from "./body/campus/tab/rightTab.tsx";
import CctvRegi from "./body/campus/regi/cctv/cctvRegi.tsx";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../store_back/zustand/main.ts";
import {
    LEFT_MENU_CAMPUS,
    LEFT_MENU_EVENT, LEFT_MENU_FAVORITE, LEFT_MOD_PATROL, LEFT_MOD_PATROL_EDIT, LEFT_MOD_PATROL_REGI,
    RIGHT_MOD_EVENT_CCTV,
    RIGHT_MOD_NONE,
    RIGHT_MOD_TAB
} from "../../../data_back/const/common.ts";
import {useEffect, useState} from "react";
import {useLeftStore} from "../../../store_back/zustand/left.ts";
import EventCctv from "./body/event/cctv/eventCctv.tsx";
import Passive from "./body/event/passive/passive.tsx";
import RightFavor from "./body/favor/rightFavor.tsx";

const Right = () => {
    const {
        activeMod,
        activeRightMod,
        activeRightEventMod,
        activeRightFavorMod,
        setActiveRightMod,
        setActiveRightEventMod,
        setActiveRightFavorMod
    } = useMainStore(useShallow((state) => ({
        activeMod: state.activeMod,
        activeRightMod: state.activeRightMod,
        activeRightEventMod: state.activeRightEventMod,
        activeRightFavorMod: state.activeRightFavorMod,
        setActiveRightMod: state.actions.setActiveRightMod,
        setActiveRightEventMod: state.actions.setActiveRightEventMod,
        setActiveRightFavorMod : state.actions.setActiveRightFavorMod
    })))

    const {activeTab, activeBuilding, activeFavorBuilding, activeEvent} = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        activeBuilding: state.activeBuilding,
        activeFavorBuilding: state.activeFavorBuilding,
        activeEvent: state.activeEvent,
    })));

    const [rightOpen, setRightOpen] = useState<boolean>(false);


    useEffect(() => {
        if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
            if (activeBuilding) {
                setActiveRightMod(RIGHT_MOD_TAB);
            } else {
                setActiveRightMod(RIGHT_MOD_NONE);
            }
        }
    }, [activeBuilding, activeTab]);


    useEffect(() => {
        if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
            if (activeFavorBuilding) {
                setActiveRightFavorMod(RIGHT_MOD_TAB);
            } else {
                setActiveRightFavorMod(RIGHT_MOD_NONE);
            }
        }
    }, [activeFavorBuilding, activeTab]);


    useEffect(() => {
        if (activeEvent) {
            setActiveRightEventMod(RIGHT_MOD_EVENT_CCTV);
        } else {
            setActiveRightEventMod(RIGHT_MOD_NONE);
        }
    }, [activeEvent]);

    useEffect(() => {

        if (activeMod.cd === LEFT_MOD_PATROL.cd || activeMod.cd === LEFT_MOD_PATROL_REGI.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd) {
            setRightOpen(false);
        } else {
            if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
                if (activeRightMod.cd === RIGHT_MOD_NONE.cd) {
                    setRightOpen(false);
                } else {
                    setRightOpen(true);
                }
            } else if (activeTab.cd === LEFT_MENU_EVENT.cd) {
                if (activeRightEventMod.cd === RIGHT_MOD_NONE.cd) {
                    setRightOpen(false);
                } else {
                    setRightOpen(true);
                }
            } else if (activeTab.cd === LEFT_MENU_FAVORITE.cd) {
                if (activeRightFavorMod.cd === RIGHT_MOD_NONE.cd) {
                    setRightOpen(false);
                } else {
                    setRightOpen(true);
                }
            } else {
                setRightOpen(false);
            }
        }
    }, [activeTab, activeMod, activeRightMod, activeRightEventMod, activeRightFavorMod]);


    return (
        <section className={`content content--right ${rightOpen ? 'active' : ''}`}>
            <div className="dimmed"></div>
            {
                activeTab.cd === LEFT_MENU_CAMPUS.cd && <RightTab/>
            }
            {
                activeTab.cd === LEFT_MENU_FAVORITE.cd &&<RightFavor/>
            }
            <CctvRegi/>
            <EventCctv/>
            <Passive/>
        </section>
    )
}

export default Right