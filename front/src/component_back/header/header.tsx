import Logo from "./top/logo.tsx";
import Top from "./top/top.tsx";
import Report from "./top/info/report.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchReports, fetchWeathers} from "../../data_back/api/common/commonApi.ts";
import {useEffect} from "react";
import {useMainStore} from "../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {MODAL_ON_BOARD} from "../../data_back/const/common.ts";

const Header = () => {
    const {setWeather, setReport, setModal} = useMainStore(useShallow((state)=> ({
        setWeather : state.actions.setWeather,
        setReport : state.actions.setReport,
        setModal : state.actions.setActiveModal
    })))

    const {data: weatherRes} = useQuery({
        queryKey: ['weather'],
        queryFn: () => fetchWeathers(),
        staleTime: 1000 * 60 * 60,
    })


    useEffect(() => {
        if(weatherRes){
            setWeather(weatherRes.data);
        }
    }, [weatherRes]);

    const {data: reportRes} = useQuery({
        queryKey: ['report'],
        queryFn: () => fetchReports(),
        staleTime: 1000 * 60 * 10,
    })

    useEffect(()=>{
        if(reportRes){
            setReport(reportRes.data);
        }
    },[reportRes])

    return (
        <header id="header" className="header">
            <Logo/>
            <Top/>
            <Report/>
            <button type="button" className="btn-onboarding" onClick={() => setModal(MODAL_ON_BOARD)}>사용가이드</button>
        </header>
    )
}

export default Header