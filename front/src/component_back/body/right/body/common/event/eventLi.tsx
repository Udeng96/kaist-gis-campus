import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {LEFT_MENU_CAMPUS, LEFT_MENU_FAVORITE, RIGHT_MENU_EVENT} from "../../../../../../data_back/const/common.ts";
import EventLiCnt from "./eventLiCnt.tsx";
import EventLiResult from "./eventLiResult.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import moment from "moment";
import {
    header,
    headerList,
    setBody,
    setBuildingNm,
    setDtmForm,
    setEventTypeNm,
    setSensorNm,
    TITLE_STYLE
} from "../../../../../../data_back/const/excel.ts";
import * as XLSX from "xlsx-js-style";
import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import type {BUILDING_TYPE, EVENT_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import EventLiSearch from "./eventLiSearch.tsx";
import EventFavorLiSearch from "./eventFavorLiSearch.tsx";


const EventLi = ({activeList, activeMenu, activeStart, activeEnd, activeBuilding}: {
    activeList: EVENT_TYPE[],
    activeMenu: string,
    activeStart: string,
    activeEnd: string,
    activeBuilding: BUILDING_TYPE | null
}) => {

    const {
        setActiveEventList,
        setActiveEventStartDtm,
        setActiveEventEndDtm,
        setActiveFavorEndDtm,
        setAcitveFavorStartDtm
    } = useRightStore(useShallow((state) => ({
        setActiveEventList: state.actions.setActiveEventList,
        setActiveEventStartDtm: state.actions.setActiveEventStartDtm,
        setActiveEventEndDtm: state.actions.setActiveEventEndDtm,
        setActiveFavorEndDtm: state.actions.setActiveFavorEndDtm,
        setAcitveFavorStartDtm: state.actions.setActiveFavorStartDtm
    })));

    const {eventList, buildingList, activeTab} = useLeftStore(useShallow((state) => ({
        eventList: state.eventList,
        buildingList: state.buildingList,
        activeTab: state.activeTab
    })));

    const sensorList = useMainStore(state => state.sensors);


    const [excelBodyList, setExcelBodyList] = useState<{
        s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
        t: string,
        v: string
    }[][]>([]);

    const handleExcelBtn = () => {
        if (activeList.length > 0) {
            let bodies: {
                s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
                t: string,
                v: string
            }[][] = []
            activeList.map((item, index) => {
                let body: {
                    s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
                    t: string,
                    v: string
                }[] = [];

                headerList.forEach((order) => {
                    body.push(setBody(order, "s"));
                })
                let bodyItem: {
                    s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
                    t: string,
                    v: string
                }[] = [];

                bodyItem.push(setBody((index + 1).toString(), "s"));
                bodyItem.push(setBody(setEventTypeNm(item.type), "s"));
                bodyItem.push(setBody(item.mappBuildingId, "s"));
                bodyItem.push(setBody(setBuildingNm(buildingList, item.mappBuildingId), "s"));
                bodyItem.push(setBody(setSensorNm(item.type, sensorList, item.mappSensorId), "s"));
                bodyItem.push(setBody(setDtmForm(item.outbDtm), "s"));
                bodyItem.push(setBody(setDtmForm(item.clrDtm), "s"));

                bodies.push(bodyItem);

            })

            setExcelBodyList(bodies);
        } else {
            setExcelBodyList([]);
            alert("엑셀 다운로드를 실패하였습니다.");
        }
    }

    useEffect(() => {
        if (activeBuilding && excelBodyList.length > 0) {
            // @ts-ignore
            const wb = XLSX.utils.book_new();
            const title = [{
                v: `${activeBuilding.id} 이벤트 발생 리스트 (${activeList.length.toLocaleString()})`,
                t: "s",
                s: {...TITLE_STYLE, alignment: {horizontal: "left"}}
            }]

            let body = [];
            body.push(header);
            body.push(...excelBodyList);

            // @ts-ignore
            const ws = XLSX.utils.aoa_to_sheet([title, ...body]);
            const header_width_list = headerList.map((_, index) => (index === 0 ? {wch: 20} : {wch: 40}))
            const body_width_list = excelBodyList.map((_) => ({hpx: 20}))
            ws["!cols"] = [...header_width_list];
            ws["!rows"] = [{hpx: 30}, {hpx: 30}, ...body_width_list];
            ws["!merges"] = [{s: {r: 0, c: 0}, e: {r: 0, c: headerList.length - 1}}];
            // @ts-ignore
            XLSX.utils.book_append_sheet(wb, ws, ` 이벤트 리스트 이력`);

            XLSX.writeFile(wb, `${activeBuilding.name} 건물 이벤트 이력 - ${moment().format('YYYYMMDD')}.xlsx`, {bookType: "xlsx"});

            setExcelBodyList([]);
        }
    }, [excelBodyList]);


    useEffect(() => {
        if (eventList.length > 0) {
            if (activeBuilding) {
                let filterEvents = eventList.filter((event) => event.mappBuildingId.includes(activeBuilding.id));
                filterEvents = filterEvents.filter((event) => (Number(event.outbDtm.substring(0, 8)) <= Number(activeEnd)) && (Number(event.outbDtm.substring(0, 8)) >= Number(activeStart)));
                setActiveEventList(filterEvents);
            } else {
                setActiveEventList([]);
            }
        } else {
            setActiveEventList([]);
        }
    }, [activeBuilding, eventList, activeStart, activeEnd]);


    useEffect(() => {
        if (activeTab.cd === LEFT_MENU_CAMPUS.cd) {
            setActiveEventStartDtm(moment().format('YYYYMMDD'))
            setActiveEventEndDtm(moment().format('YYYYMMDD'))
        } else {
            setAcitveFavorStartDtm(moment().format('YYYYMMDD'))
            setActiveFavorEndDtm(moment().format('YYYYMMDD'))
        }

    }, [activeBuilding, activeTab]);


    return (
        <li className={`tab__item tab__item--event ${activeMenu === RIGHT_MENU_EVENT.cd ? 'active' : ''}`}>
            <div className="content__sub-head">
                <h2 className="content__sub-title">이벤트 발생 현황</h2>
                <button type="button" className="btn btn-normal btn-excel" onClick={handleExcelBtn}>엑셀 다운</button>
            </div>
            {activeTab.cd === LEFT_MENU_FAVORITE.cd && <EventFavorLiSearch/>}
            {activeTab.cd === LEFT_MENU_CAMPUS.cd &&<EventLiSearch/>}
            <EventLiCnt eventList={activeList}/>
            <EventLiResult eventList={activeList}/>
        </li>
    )
}

export default EventLi