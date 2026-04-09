import {useEffect, useState} from "react";
import moment from "moment/moment";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchBuildingEvents} from "../../../../../../data_back/api/right/rightApi.ts";
import DatePicker from "tui-date-picker";

const EventLiSearch = () => {
    const {
        activeEventStartDtm,
        activeEventEndDtm,
        setActiveEventStartDtm,
        setActiveEventEndDtm,
        setActiveEventList,
    } = useRightStore(useShallow((state) => ({
        activeEventStartDtm: state.activeEventStartDtm,
        activeEventEndDtm: state.activeEventEndDtm,
        setActiveEventStartDtm: state.actions.setActiveEventStartDtm,
        setActiveEventEndDtm: state.actions.setActiveEventEndDtm,
        setActiveEventList: state.actions.setActiveEventList,
    })));

    const activeBuilding = useLeftStore((state) => state.activeBuilding);

    const [eventStartDate, setEventStartDate] = useState(moment().format("YYYYMMDD"));
    const [eventEndDate, setEventEndDate] = useState(moment().format("YYYYMMDD"));


    const {data: activeBuildEventRes} = useQuery({
        queryKey: ["activeBuildEvent", activeBuilding, activeEventEndDtm, activeEventStartDtm],
        queryFn: () => fetchBuildingEvents({
            buildingCd: activeBuilding ? activeBuilding.id : '',
            startDtm: activeEventStartDtm,
            endDtm: activeEventEndDtm
        }),
        enabled: !!activeBuilding
    })


    useEffect(() => {
        if (activeBuildEventRes) {
            setActiveEventList(activeBuildEventRes.data);
        }
    }, [activeBuildEventRes]);

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
        const startInputEl = document.getElementById("startpicker__input") as HTMLInputElement;
        const startContainerEl = document.getElementById("startpicker__container");
        const inputEl = document.getElementById("endpicker__input") as HTMLInputElement;
        const containerEl = document.getElementById("endpicker__container");

        if (inputEl && containerEl) {
            const endPicker = new DatePicker(containerEl, {
                language: 'ko',   // 👈 이렇게 지정
                date: moment(eventEndDate, 'YYYYMMDD').toDate(),
                input: {
                    element: inputEl,
                    format: "yyyy-MM-dd"
                },
            });


            endPicker.on('open', formatMonthHeader);
            endPicker.on('draw', formatMonthHeader);
            endPicker.on('change', () => {
                const selectedDate = moment(endPicker.getDate()).format("YYYYMMDD");
                setEventEndDate(selectedDate);
            });

            endPicker.setRanges([
                [moment(eventStartDate, 'YYYYMMDD').toDate(), moment().toDate()]
            ]);
        }


        if (startInputEl && startContainerEl) {
            const startPicker = new DatePicker(startContainerEl, {
                language: 'ko',   // 👈 이렇게 지정
                date: moment(eventStartDate, 'YYYYMMDD').toDate(),
                input: {
                    element: startInputEl,
                    format: "yyyy-MM-dd"
                },

            });
            startPicker.on('open', formatMonthHeader);
            startPicker.on('draw', formatMonthHeader);
            startPicker.on('change', () => {
                const selectedDate = moment(startPicker.getDate()).format("YYYYMMDD");
                setEventStartDate(selectedDate);
            });
            startPicker.setRanges([
                [moment(eventEndDate, 'YYYYMMDD').subtract(3, 'months').toDate(), moment(eventEndDate, 'YYYYMMDD').toDate()]
            ]);
        }
    }, [eventEndDate, eventStartDate, activeBuilding]);


    useEffect(() => {
        setEventStartDate(moment().format("YYYYMMDD"));
        setEventEndDate(moment().format("YYYYMMDD"));
        setActiveEventStartDtm(moment().format("YYYYMMDD"));
        setActiveEventEndDtm(moment().format("YYYYMMDD"));
    }, [activeBuilding]);

    const handleSearch = () => {
        setActiveEventEndDtm(eventEndDate);
        setActiveEventStartDtm(eventStartDate);
    }

    return (
        <div className="content__sub-head">
            <p className="mark">기간 설정</p>
            <div className="datepicker__wrap datepicker__wrap--Range">
                <div className="tui-datepicker-input datepicker">
                    <input id="startpicker__input" className="datepicker__input" type="text" aria-label="Date"/>
                    <i className="datepicker__icon"></i>
                </div>

                <div id="startpicker__container" className="tui-datepicker"></div>
                <span className="term">~</span>
                <div className="tui-datepicker-input datepicker">
                    <input id="endpicker__input" className="datepicker__input" type="text" aria-label="Date"/>
                    <i className="datepicker__icon"></i>
                </div>

                <div id="endpicker__container" className="tui-datepicker"></div>

            </div>
            <button type="button" className="btn btn-primary mini" onClick={() => handleSearch()}>검색</button>
        </div>
    )

}

export default EventLiSearch