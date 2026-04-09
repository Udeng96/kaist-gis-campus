import { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx-js-style';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { EventResponse, EventType } from '@api/types/event';
import { useCommonStore } from '@store/commonStore';
import noDataImg from '@assets/image/img/img_no-result-06_100x100.svg';

const PAGE_SIZE = 8;

const PERIOD_OPTIONS = [
    { label: '24시간', days: 1 },
    { label: '1주', days: 7 },
    { label: '1개월', days: 30 },
    { label: '3개월', days: 90 },
    { label: '6개월', days: 180 },
];

const getDateBefore = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
};

const EVENT_TYPE_OPTIONS = [
    { code: 'all', name: '전체' },
    { code: 'gas', name: '가스' },
    { code: 'fire', name: '화재' },
    { code: 'flame', name: '불꽃' },
];

const getTypeClass = (type: string) => {
    if (type === 'gas02') return 'gas02';
    if (type?.includes('gas')) return 'gas01';
    if (type === 'fire') return 'fire';
    if (type === 'flame') return 'flame';
    return type;
};

const getTypeLabel = (type: string) => {
    if (type?.includes('gas')) return '가스';
    if (type === 'fire') return '화재';
    if (type === 'flame') return '불꽃';
    return type;
};

const getLevel = (type: string) => {
    if (type === 'gas01') return '1단계';
    if (type === 'gas02') return '2단계';
    if (type === 'gas03') return '1단계';
    return '-';
};

const formatDt = (dt: string | null) => {
    if (!dt) return '-';
    const d = new Date(dt);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${String(d.getFullYear()).slice(2)}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

interface Props {
    onClose: () => void;
}

const LastEventModal = ({ onClose }: Props) => {
    const campusAreas = useCommonStore((s) => s.campusType);

    // 임시 필터
    const [tempStartDate, setTempStartDate] = useState<Date>(() => getDateBefore(1));
    const [tempEndDate, setTempEndDate] = useState<Date>(() => new Date());
    const [tempType, setTempType] = useState('all');
    const [tempArea, setTempArea] = useState('all');
    const [typeDrop, setTypeDrop] = useState(false);

    // 확정 필터
    const [startDate, setStartDate] = useState<Date>(() => getDateBefore(1));
    const [endDate, setEndDate] = useState<Date>(() => new Date());
    const [filterType, setFilterType] = useState('all');
    const [filterArea, setFilterArea] = useState('all');

    const [page, setPage] = useState(1);
    const [activeEvent, setActiveEvent] = useState<EventType | null>(null);

    // 날짜 범위가 프리셋과 일치하는지 자동 판별
    const activePeriod = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDay = new Date(tempEndDate);
        endDay.setHours(0, 0, 0, 0);

        // endDate가 오늘인지 확인
        if (endDay.getTime() !== today.getTime()) return -1;

        const diffMs = endDay.getTime() - new Date(tempStartDate).setHours(0, 0, 0, 0);
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        const match = PERIOD_OPTIONS.find((p) => p.days === diffDays);
        return match ? match.days : -1;
    }, [tempStartDate, tempEndDate]);

    const startDtm = useMemo(() => {
        const d = new Date(startDate);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
    }, [startDate]);

    const endDtm = useMemo(() => {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        return d.toISOString();
    }, [endDate]);

    const { data } = useQuery({
        queryKey: ['lastEvents', startDtm, endDtm],
        queryFn: () => getHttp<EventResponse>(BASE_URL + END_POINT.EVENT.ALL, { startDtm, endDtm }),
    });

    const filtered = useMemo(() => {
        let list = data?.events ?? [];
        if (filterType !== 'all') list = list.filter((e) => e.type?.startsWith(filterType));
        if (filterArea !== 'all') list = list.filter((e) => e.buildingCode?.startsWith(filterArea));
        return list;
    }, [data, filterType, filterArea]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageList = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handlePeriod = (days: number) => {
        const end = new Date();
        const start = getDateBefore(days);
        setTempStartDate(start);
        setTempEndDate(end);
    };

    const handleSearch = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setFilterType(tempType);
        setFilterArea(tempArea);
        setPage(1);
        setActiveEvent(null);
    };

    const handleReset = () => {
        setTempStartDate(getDateBefore(1));
        setTempEndDate(new Date());
        setTempType('all');
        setTempArea('all');
    };

    const handleExcel = useCallback(() => {
        if (filtered.length === 0) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const HEADER_STYLE = { font: { sz: 12, bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { fgColor: { rgb: '3A4357' } } };
        const BODY_STYLE = { font: { sz: 11, bold: false }, alignment: { horizontal: 'center', vertical: 'center' } };
        const TITLE_STYLE = { font: { sz: 14, bold: true }, alignment: { horizontal: 'center', vertical: 'center' } };

        const pad = (n: number) => String(n).padStart(2, '0');
        const fmtDate = (s: Date) => `${s.getFullYear()}${pad(s.getMonth() + 1)}${pad(s.getDate())}`;

        const title = [{ v: `${fmtDate(startDate)} ~ ${fmtDate(endDate)} 이벤트 발생 리스트 (${filtered.length.toLocaleString()})`, t: 's', s: TITLE_STYLE }];
        const headers = ['No', '유형', '건물코드', '건물명', '센서ID', '발생일시', '종료일시'].map((h) => ({ v: h, t: 's', s: HEADER_STYLE }));

        const rows = filtered.map((ev, i) => [
            { v: String(i + 1), t: 's', s: BODY_STYLE },
            { v: getTypeLabel(ev.type), t: 's', s: BODY_STYLE },
            { v: ev.buildingCode ?? '-', t: 's', s: BODY_STYLE },
            { v: ev.buildingCode ?? '-', t: 's', s: BODY_STYLE },
            { v: ev.sensorId ?? '-', t: 's', s: BODY_STYLE },
            { v: formatDt(ev.occurredAt), t: 's', s: BODY_STYLE },
            { v: formatDt(ev.clearedAt), t: 's', s: BODY_STYLE },
        ]);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([title, headers, ...rows]);
        ws['!cols'] = [{ wch: 8 }, { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 22 }];
        ws['!rows'] = [{ hpx: 30 }, { hpx: 28 }, ...rows.map(() => ({ hpx: 22 }))];
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
        XLSX.utils.book_append_sheet(wb, ws, '이벤트 리스트');

        const today = new Date();
        XLSX.writeFile(wb, `이벤트_${fmtDate(today)}.xlsx`, { bookType: 'xlsx' });
    }, [filtered, startDate, endDate]);

    return createPortal(
        <div className="modal">
            <div className="dimmed" />
            <div className="modal__content">
                {/* Head */}
                <div className="modal__head">
                    <h2 className="modal__title">지난 이벤트 내역</h2>
                    <button className="btn-close modal-close" onClick={onClose} />
                </div>

                {/* Body */}
                <div className="modal__body">
                    {/* 필터 */}
                    <div className="filter">
                        <div className="filter__frame">
                            <p className="mark label">검색 기간</p>
                            <div className="value-wrap">
                                <div className="value">
                                    <div className="sub-tab__wrap-2">
                                        {PERIOD_OPTIONS.map((p) => (
                                            <button key={p.label} type="button" className={`sub-tab ${activePeriod === p.days ? 'active' : ''}`} onClick={() => handlePeriod(p.days)}>
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="value">
                                    <div className="datepicker__wrap datepicker__wrap--Range">
                                        <div className="datepicker">
                                            <DatePicker
                                                selected={tempStartDate}
                                                onChange={(d: Date | null) => { if (d) { setTempStartDate(d); } }}
                                                dateFormat="yyyy-MM-dd"
                                                maxDate={tempEndDate}
                                                className="datepicker__input"
                                            />
                                        </div>
                                        <span className="term">~</span>
                                        <div className="datepicker">
                                            <DatePicker
                                                selected={tempEndDate}
                                                onChange={(d: Date | null) => { if (d) { setTempEndDate(d); } }}
                                                dateFormat="yyyy-MM-dd"
                                                minDate={tempStartDate}
                                                maxDate={new Date()}
                                                className="datepicker__input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filter__frame">
                            <p className="mark label">이벤트 유형</p>
                            <div className="value">
                                <div className={`select-box ${typeDrop ? 'active' : ''}`}>
                                    <button className="btn--select" onClick={() => setTypeDrop(!typeDrop)}>
                                        {EVENT_TYPE_OPTIONS.find((t) => t.code === tempType)?.name ?? '전체'}
                                    </button>
                                    <div className="drop-down">
                                        <ul className="ct-scroll">
                                            {EVENT_TYPE_OPTIONS.map((item) => (
                                                <li key={item.code} className={`select__item ${tempType === item.code ? 'selected' : ''}`}>
                                                    <button onClick={() => { setTempType(item.code); setTypeDrop(false); }}>{item.name}</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filter__frame">
                            <p className="mark label">캠퍼스 구역</p>
                            <div className="value">
                                <div className="sub-tab__wrap-2">
                                    <button type="button" className={`sub-tab ${tempArea === 'all' ? 'active' : ''}`} onClick={() => setTempArea('all')}>전체</button>
                                    {campusAreas.map((area) => (
                                        <button key={area.code} type="button" className={`sub-tab ${tempArea === area.code ? 'active' : ''}`} onClick={() => setTempArea(area.code)}>
                                            {area.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="filter__footer">
                            <button type="button" className="btn btn-normal btn-reset" onClick={handleReset}>초기화</button>
                            <button type="button" className="btn btn-primary btn-check" onClick={handleSearch}>조회</button>
                        </div>
                    </div>

                    {/* 결과 */}
                    <div className="result">
                        <p>조회 결과<span>{filtered.length}</span>건</p>
                        <button type="button" className="btn btn-normal btn-excel" onClick={handleExcel}>엑셀 다운</button>
                    </div>

                    {/* 리스트 */}
                    <div className="hist">
                        <div className="hist__frame">
                            <div className="list list--event">
                                <div className="list__head">
                                    <p>유형</p>
                                    <p>단계</p>
                                    <p>건물명</p>
                                    <p>발생 일시</p>
                                    <p>종료 일시</p>
                                </div>
                                <div className="list__body">
                                    {pageList.length > 0 ? (
                                        <ul>
                                            {pageList.map((ev) => (
                                                <li key={ev.id}
                                                    className={`list__item ${getTypeClass(ev.type)} ${activeEvent?.id === ev.id ? 'active' : ''}`}
                                                    onClick={() => setActiveEvent(activeEvent?.id === ev.id ? null : ev)}
                                                >
                                                    <p>{getTypeLabel(ev.type)}</p>
                                                    <p>{getLevel(ev.type)}</p>
                                                    <p>{ev.buildingCode ?? '-'}</p>
                                                    <p>{formatDt(ev.occurredAt)}</p>
                                                    <p>{formatDt(ev.clearedAt)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="error-frame">
                                            <img src={noDataImg} alt="no data" />
                                            <p>현재 조건에 해당되는 데이터가 없습니다.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* 페이징 */}
                            <div className="paging">
                                <div className="btn-wrap">
                                    <button type="button" className="btn__paging btn__paging--first" disabled={page <= 1} onClick={() => setPage(1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 16L7 12L11 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M15 16L11 12L15 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button type="button" className="btn__paging btn__paging--prev" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M13 16L9 12L13 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="num">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <a key={p} href="#" className={`btn__paging btn__num ${page === p ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</a>
                                    ))}
                                </div>
                                <div className="btn-wrap">
                                    <button type="button" className="btn__paging btn__paging--next" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 8L15 12L11 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button type="button" className="btn__paging btn__paging--last" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M13 8L17 12L13 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M9 8L13 12L9 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* 상세 정보 */}
                        <div className="hist__frame details">
                            <div className="details__head">이벤트 상세 정보</div>
                            <div className="details__body">
                                <div className="frame-wrap">
                                    <div className="frame">
                                        <p className="label">그룹명</p>
                                        <div className="value">
                                            <input type="text" value={activeEvent ? getTypeLabel(activeEvent.type) : '-'} disabled />
                                        </div>
                                    </div>
                                    <div className="frame">
                                        <p className="label">단계</p>
                                        <div className="value">
                                            <input type="text" value={activeEvent ? getLevel(activeEvent.type) : '-'} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="frame">
                                    <p className="label">건물명</p>
                                    <div className="value">
                                        <input type="text" value={activeEvent?.buildingCode ?? ''} disabled />
                                    </div>
                                </div>
                                <div className="frame">
                                    <p className="label">발생 일시</p>
                                    <div className="value">
                                        <input type="text" value={activeEvent ? formatDt(activeEvent.occurredAt) : ''} disabled />
                                    </div>
                                </div>
                                <div className="frame">
                                    <p className="label">종료 일시</p>
                                    <div className="value">
                                        <input type="text" value={activeEvent ? formatDt(activeEvent.clearedAt) : ''} disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LastEventModal;
