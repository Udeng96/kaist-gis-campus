import {
    headerList,
    setBody,
    setBuildingNm, setDtmForm,
    setEventTypeNm,
    setHeader, setSensorNm,
    TITLE_STYLE
} from "../../../../../data_back/const/excel.ts";
import {useLeftStore} from "../../../../../store_back/zustand/left.ts";
import {useEffect, useState} from "react";
import moment from "moment";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../../store_back/zustand/main.ts";
import * as XLSX from "xlsx-js-style";

const LastResult = () => {

    const {lastEventList, buildingList, lastEventStartDate, lastEventEndDate} = useLeftStore(useShallow((state) => ({
        lastEventList: state.lastEventList,
        lastEventStartDate : state.lastEventStartDate,
        lastEventEndDate : state.lastEventEndDate,
        buildingList: state.buildingList,
    })));

    const sensorList = useMainStore((state) => state.sensors);

    const [excelBodyList, setExcelBodyList] = useState<{
        s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
        t: string,
        v: string
    }[][]>([]);

    const handleExcelBtn = () => {
        if (lastEventList.length > 0) {
            let bodies: {
                s: { alignment: { horizontal: string, vertical: string }, font: { sz: string, bold: boolean } },
                t: string,
                v: string
            }[][] = []
            lastEventList.map((item, index) => {
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
                bodyItem.push(setBody(setSensorNm(item.type,sensorList, item.mappSensorId), "s"));
                bodyItem.push(setBody(setDtmForm(item.outbDtm), "s"));
                bodyItem.push(setBody(setDtmForm(item.clrDtm), "s"));

                bodies.push(bodyItem);

            })

            setExcelBodyList(bodies);
        }else{
            setExcelBodyList([]);
            alert("엑셀 다운로드를 실패하였습니다.");
        }
    }

    useEffect(() => {
        if(excelBodyList.length>0){
            // @ts-ignore
            const wb = XLSX.utils.book_new();
            const title = [{
                v: `${lastEventStartDate} ~ ${lastEventEndDate} 이벤트 발생 리스트 (${lastEventList.length.toLocaleString()})`,
                t: "s",
                s: {...TITLE_STYLE, alignment: {horizontal: "left"}}
            }]

            const header = headerList.map((headerItem) => setHeader(headerItem, "s"));
            let body = [];
            body.push(header);
            body.push(...excelBodyList);

            // @ts-ignore
            const ws = XLSX.utils.aoa_to_sheet([title, ...body]);
            const header_width_list = headerList.map((_,index) => (index===0 ? {wch: 20} : {wch: 40}))
            const body_width_list = excelBodyList.map((_) => ({hpx: 20}))
            ws["!cols"] = [...header_width_list];
            ws["!rows"] = [{hpx: 30}, {hpx: 30}, ...body_width_list];
            ws["!merges"] = [{s: {r: 0, c: 0}, e: {r: 0, c: headerList.length - 1}}];
            // @ts-ignore
            XLSX.utils.book_append_sheet(wb, ws, `이벤트 리스트 이력`);

            XLSX.writeFile(wb, `${moment().format('YYYYMMDD')}.xlsx`, {bookType: "xlsx"});

            setExcelBodyList([]);
        }
    }, [excelBodyList]);

    return (
        <div className="result">
            <p>조회 결과<span>{lastEventList.length}</span>건</p>
            <button type="button" className="btn btn-normal btn-excel" onClick={()=>handleExcelBtn()}>엑셀 다운</button>
        </div>
    )
}

export default LastResult