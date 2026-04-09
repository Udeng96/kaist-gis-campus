import {useEffect, useState} from "react";
import moment from "moment/moment";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchBuildingEvents} from "../../../../../../data_back/api/right/rightApi.ts";
import DatePicker from "tui-date-picker";

const EventFavorLiSearch = () => {
    const {
        activeFavorStartDtm,
        activeFavorEndDtm,
        setActiveFavorStartDtm,
        setActiveFavorEndDtm,
        setActiveFavorList,
    } = useRightStore(useShallow((state) => ({
        activeFavorStartDtm: state.activeFavorStartDtm,
        activeFavorEndDtm: state.activeFavorEndDtm,
        setActiveFavorStartDtm: state.actions.setActiveFavorStartDtm,
        setActiveFavorEndDtm: state.actions.setActiveFavorEndDtm,
        setActiveFavorList: state.actions.setActiveFavorList,
    })));

    const activeTab = useLeftStore(state=> state.activeTab);

    const activeFavorBuilding = useLeftStore((state) => state.activeFavorBuilding);
    const [startDate, setStartDate] = useState<string>(moment().format("YYYYMMDD"));
    const [endDate, setEndDate] = useState<string>(moment().format("YYYYMMDD"));


    const {data: activeBuildEventRes} = useQuery({
        queryKey: ["activeBuildEvent", activeFavorBuilding, activeFavorStartDtm, activeFavorEndDtm],
        queryFn: () => fetchBuildingEvents({
            buildingCd: activeFavorBuilding ? activeFavorBuilding.id : '',
            startDtm: activeFavorStartDtm,
            endDtm: activeFavorEndDtm
        }),
        enabled: !!activeFavorBuilding
    })


    useEffect(() => {
        if (activeBuildEventRes) {
            setActiveFavorList(activeBuildEventRes.data);
        }
    }, [activeBuildEventRes]);

    useEffect(() => {
        setActiveFavorStartDtm(moment().format("YYYYMMDD"));
        setActiveFavorEndDtm(moment().format("YYYYMMDD"));
        setEndDate(moment().format("YYYYMMDD"));
        setStartDate(moment().format("YYYYMMDD"));
    }, [activeFavorBuilding]);


    const formatMonthHeader = () => {
        setTimeout(() => {
            // TUI DatePicker의 월 헤더 요소 찾기
            const monthElements = document.querySelectorAll('.tui-calendar-month');
            monthElements.forEach((element) => {
                const text = element.textContent;
                if (text) {
                    // "September 2025" 또는 "9월 2025" 형식을 "2025.09"로 변환
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

                    // 영어 월 이름 처리
                    const parts = text.split(' ');
                    if (parts.length === 2) {
                        const monthName = parts[0];
                        const year = parts[1];
                        const monthIndex = monthNames.indexOf(monthName);
                        if (monthIndex !== -1) {
                            const monthNumber = (monthIndex + 1).toString().padStart(2, '0');
                            element.textContent = `${year}.${monthNumber}`;
                        }
                    }

                    // 한국어 월 이름 처리 (예: "9월 2025")
                    const koreanMatch = text.match(/(\d+)월\s+(\d+)/);
                    if (koreanMatch) {
                        const month = koreanMatch[1].padStart(2, '0');
                        const year = koreanMatch[2];
                        element.textContent = `${year}.${month}`;
                    }
                }
            });
        }, 100);
    };

    useEffect(() => {
        // input & container DOM 가져오기
        const startInputEl = document.getElementById("startpicker__input-05") as HTMLInputElement;
        const startContainerEl = document.getElementById("startpicker__container-05");
        const inputEl = document.getElementById("endpicker__input-05") as HTMLInputElement;
        const containerEl = document.getElementById("endpicker__container-05");

        if (inputEl && containerEl) {
            const endPicker = new DatePicker(containerEl, {
                language: 'ko',   // 👈 이렇게 지정ㄴ
                date: moment(endDate, 'YYYYMMDD').toDate(),
                input: {
                    element: inputEl,
                    format: "yyyy-MM-dd"
                },
            });

            endPicker.on('open', formatMonthHeader);
            endPicker.on('draw', formatMonthHeader);
            endPicker.on('change', () => {
                const selectedDate = moment(endPicker.getDate()).format("YYYYMMDD");
                setEndDate(selectedDate);
            });

            endPicker.setRanges([
                [moment(startDate, 'YYYYMMDD').toDate(), new Date()]
            ]);
        }


        if (startInputEl && startContainerEl) {
            const startPicker = new DatePicker(startContainerEl, {
                language: 'ko',   // 👈 이렇게 지정
                date: moment(startDate, 'YYYYMMDD').toDate(),
                input: {
                    element: startInputEl,
                    format: "yyyy-MM-dd"
                },

            });
            startPicker.on('open', formatMonthHeader);
            startPicker.on('draw', formatMonthHeader);
            startPicker.on('change', () => {
                const selectedDate = moment(startPicker.getDate()).format("YYYYMMDD");
                setStartDate(selectedDate)
            });
            startPicker.setRanges([
                [moment(endDate, 'YYYYMMDD').subtract(3, 'months').toDate(), moment(endDate, 'YYYYMMDD').toDate()]
            ]);
        }
    }, [startDate, endDate, activeTab]);


    const handleSearch = () => {
        setActiveFavorEndDtm(endDate);
        setActiveFavorStartDtm(startDate);
    }

    return (
        <div className="content__sub-head">
            <p className="mark">기간 설정</p>
            <div className="datepicker__wrap datepicker__wrap--Range" >
                <div className="tui-datepicker-input datepicker" >
                    <input id="startpicker__input-05" className="datepicker__input" type="text"
                           aria-label="Date"/>
                    <i className="datepicker__icon"></i>
                    <div id="startpicker__container-05"></div>
                </div>

                <span className="term">~</span>

                <div className="tui-datepicker-input datepicker" >
                    <input id="endpicker__input-05" className="datepicker__input" type="text"
                           aria-label="Date"/>
                    <i className="datepicker__icon"></i>
                    <div id="endpicker__container-05"></div>
                </div>
            </div>
            <button type="button" className="btn btn-primary mini" onClick={() => handleSearch()}>검색</button>
        </div>
    )

}

export default EventFavorLiSearch