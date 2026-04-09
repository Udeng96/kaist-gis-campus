import {
    DTM_DATE,
    DTM_ONE_MONTH,
    DTM_ONE_WEEK,
    DTM_SIX_MONTH,
    DTM_THREE_MONTH, EVENT_TYPE_FIRE, EVENT_TYPE_FLAME, EVENT_TYPE_GAS,
    EVENT_TYPE_WHOLE, LEFT_CAMPUS_E, LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_WHOLE
} from "../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useRef, useState} from "react";
import DatePicker from "tui-date-picker";
import moment from "moment";

const LastSearch = () => {

    const DATE_LIST = [DTM_DATE, DTM_ONE_WEEK, DTM_ONE_MONTH, DTM_THREE_MONTH, DTM_SIX_MONTH];
    const AREA_LIST = [LEFT_CAMPUS_WHOLE, LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_E];
    const TYPE_LIST = [EVENT_TYPE_WHOLE, EVENT_TYPE_GAS, EVENT_TYPE_FIRE, EVENT_TYPE_FLAME]

    const {lastEventStartDate, lastEventEndDate, lastEventSearchType, lastEventSearchArea, setLastEventStartDate, setLastEventEndDate, setLastEventSearchArea, setLastEventSearchType, setLastEventSearchParam} = useLeftStore(useShallow((state)=> ({
        lastEventStartDate : state.lastEventStartDate,
        lastEventEndDate : state.lastEventEndDate,
        lastEventSearchType : state.lastEventSearchType,
        lastEventSearchArea : state.lastEventSearchArea,
        setLastEventStartDate : state.actions.setLastEventStartDate,
        setLastEventEndDate : state.actions.setLastEventEndDate,
        setLastEventSearchArea : state.actions.setLastEventSearchArea,
        setLastEventSearchType : state.actions.setLastEventSearchType,
        setLastEventSearchParam : state.actions.setLastEventSearchParam,
    })))

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);


    const formatMonthHeader = () => {
        setOpen(false);
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
        const startInputEl =  document.getElementById("startpicker__input-01") as HTMLInputElement;
        const startContainerEl = document.getElementById("startpicker__container-01");
        const inputEl = document.getElementById("endpicker__input-01") as HTMLInputElement;
        const containerEl = document.getElementById("endpicker__container-01");


        if (inputEl && containerEl) {
            const endPicker = new DatePicker(containerEl, {
                language: 'ko',   // 👈 이렇게 지정
                date: moment(lastEventEndDate, 'YYYYMMDD').toDate(),
                input: {
                    element: inputEl,
                    format: "yyyy-MM-dd"
                },
            });

            endPicker.on('open', formatMonthHeader);
            endPicker.on('draw', formatMonthHeader);
            endPicker.on('change', () => {
                const selectedDate = moment(endPicker.getDate()).format("YYYYMMDD");
                setLastEventEndDate(selectedDate);
            });

            endPicker.setRanges([
                [moment(lastEventStartDate, 'YYYYMMDD').toDate(), new Date()]
            ]);
        }

        if (startInputEl && startContainerEl) {
            const startPicker = new DatePicker(startContainerEl, {
                language: 'ko',   // 👈 이렇게 지정
                date: moment(lastEventStartDate, 'YYYYMMDD').toDate(),
                input: {
                    element: startInputEl,
                    format: "yyyy-MM-dd"
                },

            });
            startPicker.on('open', formatMonthHeader);
            startPicker.on('draw', formatMonthHeader);
            startPicker.on('change', () => {
                const selectedDate = moment(startPicker.getDate()).format("YYYYMMDD");
                setLastEventStartDate(selectedDate);
            });

            startPicker.setRanges([
                [new Date(1900, 0, 1), moment(lastEventEndDate,'YYYYMMDD').toDate()]
            ]);
        }
    }, [lastEventEndDate, lastEventStartDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleType = (type : {cd:string,nm:string}) => {
        setLastEventSearchType(type);
        setOpen(false);
    }

    const handlePeriod = (period:{cd:string, nm:string, start:string, end:string}) => {
        setLastEventStartDate(period.start);
        setLastEventEndDate(period.end);
    }

    const handleReset = () => {
        setLastEventSearchArea(LEFT_CAMPUS_WHOLE);
        setLastEventSearchType(EVENT_TYPE_WHOLE);
        setLastEventStartDate(DTM_DATE.start);
        setLastEventEndDate(DTM_DATE.end);
    }

    const handleSearch = () => {
        setLastEventSearchParam({eventArea : lastEventSearchArea.cd, eventType: lastEventSearchType.cd, startDtm : lastEventStartDate, endDtm : lastEventEndDate})
    }

    return(
        <div className="filter">
            <div className="filter__frame">
                <p className="mark label">검색 기간</p>
                <div className="value-wrap">
                    <div className="value">
                        <div className="sub-tab__wrap-2">
                            {
                                DATE_LIST.map((date)=>(
                                    <button key={date.cd} type="button" className={`sub-tab ${lastEventStartDate === date.start &&  lastEventEndDate === date.end ? 'active' : ''}`} onClick={()=> handlePeriod(date)}>{date.nm}</button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="value">
                        <div className="datepicker__wrap datepicker__wrap--Range" >
                            <div className="tui-datepicker-input datepicker" >
                                <input id="startpicker__input-01" className="datepicker__input" type="text"
                                       aria-label="Date" onClick={() => setOpen(false)}/>
                                <i className="datepicker__icon"></i>
                                <div id="startpicker__container-01"></div>
                            </div>

                            <span className="term">~</span>

                            <div className="tui-datepicker-input datepicker" >
                                <input id="endpicker__input-01" className="datepicker__input" type="text"
                                       aria-label="Date" onClick={() => setOpen(false)}/>
                                <i className="datepicker__icon"></i>
                                <div id="endpicker__container-01"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filter__frame" ref={wrapperRef}>
                <p className="mark label">이벤트 유형</p>
                <div className="value">
                    <div className={`select-box ${open ? 'active' : ''}`}>
                        <button className={`btn--select `} onClick={() => setOpen(!open)}>{lastEventSearchType.nm}</button>
                        <div className={`drop-down `} onClick={() => setOpen(!open)}>
                            <ul className="ct-scroll">
                                {
                                    TYPE_LIST.map((type)=>(
                                        <li  key={type.cd} className={`select__item ${lastEventSearchType.cd === type.cd ? 'selected' :''}`} >
                                                <button onClick={()=> handleType(type)}>{type.nm}</button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filter__frame" >
                <p className="mark label">캠퍼스 구역</p>
                <div className="value">
                    <div className="sub-tab__wrap-2">
                        {
                            AREA_LIST.map((area)=>(
                                <button key={`LAST_EVENT_AREA_${area.cd}`} type="button" className={`sub-tab ${lastEventSearchArea.cd === area.cd ? 'active' : ''}`} onClick={() => setLastEventSearchArea(area)}>{area.nm}</button>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="filter__footer">
                <button type="button" className="btn btn-normal btn-reset" onClick={handleReset}>초기화</button>
                <button type="button" className="btn btn-primary btn-check" onClick={handleSearch}>조회</button>
            </div>
        </div>
    )

}

export default LastSearch