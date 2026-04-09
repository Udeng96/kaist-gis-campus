import TabHead from "./tab/tabHead.tsx";
import TabBody from "./tab/tabBody.tsx";
import PatrolHead from "./patrol/patrolHead.tsx";
import PatrolBody from "./patrol/patrolBody.tsx";
import {useMainStore} from "../../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {LEFT_MOD_PATROL, LEFT_MOD_PATROL_EDIT, LEFT_MOD_PATROL_REGI, LEFT_MOD_TAB} from "../../../data_back/const/common.ts";
import RegiHead from "./patrol/mod/regi/regiHead.tsx";
import RegiBody from "./patrol/mod/regi/regiBody.tsx";
import RegiFoot from "./patrol/mod/regi/regiFoot.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchPatrols} from "../../../data_back/api/left/leftApi.ts";
import {useEffect} from "react";
import {useLeftStore} from "../../../store_back/zustand/left.ts";
import {useFavoriteStore} from "../../../store_back/zustand/favorite.ts";
import {fetchSensros} from "../../../data_back/api/common/commonApi.ts";

const Left = () => {

    const {activeLeft, activeMod, setActiveLeft, setSensors} = useMainStore(useShallow((state) => ({
        activeLeft: state.activeLeft,
        activeMod: state.activeMod,
        setActiveLeft: state.actions.setActiveLeft,
        setSensors : state.actions.setSensors,
    })))

    const {setPatrolList} = useLeftStore(useShallow((state)=> ({
        setPatrolList : state.actions.setPatrolList
    })))

    const {initFavorites, syncFavorites} = useFavoriteStore(useShallow((state)=> ({
        initFavorites : state.actions.initFavorites,
        syncFavorites : state.actions.syncFavorites,
    })))

    useEffect(() => {
        (async () => {
            await initFavorites();
        })();
    }, []);

    useEffect(() => {

        const timer = setInterval(() => {
            (async () => {
                await syncFavorites();
            })();
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => syncFavorites();
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const {data : sensors} = useQuery({
        queryKey : ['allSensors'],
        queryFn : () => fetchSensros(),
        staleTime : Infinity,
    })

    useEffect(() => {
        if(sensors && sensors.data){
            setSensors(sensors.data);
        }
    },[sensors])


    const {data: patrolsRes} = useQuery({
        queryKey: ['patrols'],
        queryFn: () => fetchPatrols(),
        staleTime: Infinity,
    })

    useEffect(() => {
        if(patrolsRes){
            if(patrolsRes.data){
                setPatrolList(patrolsRes.data);
            }
        }
    }, [patrolsRes]);


    return (
        <section className={`content content--left ${activeLeft ? 'active' : ''}`}>
            <div className="dimmed"></div>
            <button type="button" className="btn-slide btn-slide--left" onClick={() => setActiveLeft(!activeLeft)}/>
            <div className={`tab ${activeMod.cd === LEFT_MOD_TAB.cd ? 'active' : ''}`}>
                <TabHead/>
                <TabBody/>
            </div>
            {/*순찰 모드*/}
            <div className={`patrol ${activeMod.cd === LEFT_MOD_PATROL.cd ? 'active' : ''}`}>
                <PatrolHead/>
                <PatrolBody/>
            </div>
            {/*순찰 등록 모드*/}
            <div className={`patrol-regi`}>
                <div
                    className={`content__frame content__frame--register ${activeMod.cd === LEFT_MOD_PATROL_REGI.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd ? 'active' : ''}`}>
                    <RegiHead/>
                    <RegiBody/>
                    <RegiFoot/>
                </div>
            </div>


        </section>
    )
}

export default Left