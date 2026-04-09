import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, Pane, useMap, useMapEvents } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import type { Feature } from 'geojson';
import { useFacStore } from '@store/facStore';
import { useCampusStore } from '@store/campusStore';
import { useEventStore } from '@store/eventStore';
import { useFavoriteStore } from '@store/favoriteStore';
import { useCommonClientStore } from '@store/appStore';
import { usePatrolStore } from '@store/patrolStore';
import type { BuildingType, CctvType } from '@api/types/fac';
import type { EventType } from '@api/types/event';
import { DEFAULT_CENTER, DEFAULT_ZOOM, SECTION_ZOOM, TILES, WORLD_GEOJSON, KAIST_GEOJSON, N_LAT_LNG, E_LAT_LNG, W_LAT_LNG } from '@constants/gis';
import { CCTV_TYPE_CODE } from '@constants/meta';
import PatrolPlayer from '../features/patrol/PatrolPlayer';

/* ── 마스크 GeoJSON ── */
const buildMaskFeature = (): Feature => ({
    type: 'Feature',
    geometry: {
        type: 'Polygon',
        coordinates: [[...WORLD_GEOJSON], [...KAIST_GEOJSON].reverse()],
    },
    properties: {},
});

/* ── 마커 아이콘 ── */
const buildingIcon = (code: string, isActive: boolean) => {
    const size: [number, number] = isActive ? [45, 62] : [26, 26];
    return L.divIcon({
        className: 'building_icon',
        html: `<button class="gis__icon-wrap"><i class="gis__icon building ${isActive ? 'active' : ''}"></i><div class="name">${code}</div></button>`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
    });
};

const ZOOM_THRESHOLD = 17;

const cctvIcon = (type: string, idx: number, isZoomed: boolean, isPatrolCurrent = false) => {
    const typeClass = type === 'IN' ? 'in' : type === 'OUT' ? 'out' : 'flame';
    const isNumbered = idx >= 0;

    if (isNumbered) {
        const pulseClass = isPatrolCurrent ? ' patrol-pulse' : '';
        return L.divIcon({
            className: 'cctv_icon',
            html: `<button class="gis__icon-wrap${pulseClass}"><i class="gis__icon cctv cctv-${typeClass} num"></i><div class="cctv-num"><span>${idx + 1}</span></div></button>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }

    if (isZoomed) {
        return L.divIcon({
            className: 'cctv_icon',
            html: `<button class="gis__icon-wrap"><i class="gis__icon cctv cctv-${typeClass} zoom"></i></button>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    }

    return L.divIcon({
        className: 'cctv_icon',
        html: `<button class="gis__icon-wrap"><i class="gis__icon cctv cctv-${typeClass}"></i></button>`,
        iconSize: [13, 13],
        iconAnchor: [6, 6],
    });
};

const eventIcon = (type: string, isActive: boolean, buildingCode: string, buildingName: string) => {
    const typeClass = type === 'gas02' ? 'event-gas02' : type?.includes('gas') ? 'event-gas01' : type === 'fire' ? 'event-fire' : 'event-flame';
    return L.divIcon({
        className: 'building_icon',
        html: `<button class="gis__icon-wrap"><i class="gis__icon event ${typeClass} ${isActive ? 'active' : ''}"></i><div class="name">${buildingCode}<span>${buildingName}</span></div></button>`,
        iconSize: [45, 62],
        iconAnchor: [22, 62],
    });
};

/* ── 내부 컴포넌트 ── */
const MapController = ({ activeBuilding }: { activeBuilding: BuildingType | null }) => {
    const map = useMap();
    useEffect(() => {
        if (!activeBuilding) return;
        const { xcoord, ycoord } = activeBuilding.facInfo;
        if (!ycoord || !xcoord) return;

        const target = L.latLng(Number(ycoord), Number(xcoord));
        const current = map.getCenter();
        const currentZoom = map.getZoom();

        // 이미 같은 위치+줌이면 flyTo 하지 않음
        const isSamePos = current.distanceTo(target) < 1; // 1m 이내
        const isSameZoom = currentZoom === SECTION_ZOOM;
        if (isSamePos && isSameZoom) return;

        map.flyTo(target, SECTION_ZOOM, { duration: 0.5 });
    }, [activeBuilding]);
    return null;
};

const ZoomSync = ({ onChange }: { onChange: (z: number) => void }) => {
    const map = useMap();
    useMapEvents({ zoomend: () => onChange(map.getZoom()) });
    return null;
};

const ZoomControl = ({ zoom, rightOffset = 0 }: { zoom: number; rightOffset?: number }) => {
    const map = useMap();
    return (
        <div className="gis__controller" style={{ zIndex: 1000, right: 20 + rightOffset, transition: 'right 550ms ease' }}>
            <div className="frame frame--zoom">
                <button type="button" className="btn__zoom btn__zoom--plus" disabled={zoom >= 18} onClick={() => map.zoomIn()} />
                <button type="button" className="btn__zoom btn__zoom--minus" disabled={zoom <= 11} onClick={() => map.zoomOut()} />
            </div>
        </div>
    );
};

const TileControl = ({ activeTile, onChange, rightOffset = 0 }: { activeTile: string; onChange: (t: string) => void; rightOffset?: number }) => (
    <div className="gis__map" style={{ position: 'absolute', right: 20 + rightOffset, bottom: 44, zIndex: 1000, transition: 'right 550ms ease' }}>
        <button type="button" className={`btn__gis-type btn__gis-type--2d ${activeTile === 'NORMAL' ? 'active' : ''}`} onClick={() => onChange('NORMAL')}>일반</button>
        <button type="button" className={`btn__gis-type btn__gis-type--3d ${activeTile === 'SATELLITE' ? 'active' : ''}`} onClick={() => onChange('SATELLITE')}>위성</button>
    </div>
);

const MapLegend = ({ rightOffset = 0 }: { rightOffset?: number }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className={`gis__legend ${isOpen ? 'open' : ''}`} style={{ zIndex: 1000, right: 20 + rightOffset, transition: 'right 550ms ease' }}>
            <button className="gis__legend__head" onClick={() => setIsOpen(!isOpen)}>지도 범례</button>
            <div className="gis__legend__body">
                <div className="gis__legend__frame">
                    <p className="gis__legend__title">CCTV</p>
                    <ul className="row">
                        <li className="icon__item"><i className="ic-cctv-in" /><p>내부</p></li>
                        <li className="icon__item"><i className="ic-cctv-out" /><p>외부</p></li>
                        <li className="icon__item"><i className="ic-cctv-flame" /><p>불꽃</p></li>
                    </ul>
                </div>
                <div className="gis__legend__frame">
                    <p className="gis__legend__title">이벤트</p>
                    <ul>
                        <li className="icon__item"><i className="ic-gas01" /><p>가스 1단계</p></li>
                        <li className="icon__item"><i className="ic-gas02" /><p>가스 2단계</p></li>
                        <li className="icon__item"><i className="ic-fire" /><p>화재</p></li>
                        <li className="icon__item"><i className="ic-flame" /><p>화염</p></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const SectionZone = ({ onZone }: { onZone: (center: [number, number], zoom: number) => void }) => (
    <div className="gis__zone" style={{ zIndex: 1000, position: 'relative', left: 'unset', bottom: 'unset' }}>
        <h4 className="gis__zone__title">구역 선택</h4>
        <div className="map">
            <svg className="zone zone-e" width="50" height="52" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => onZone(E_LAT_LNG, SECTION_ZOOM)}>
                <g clipPath="url(#clip0_e)"><path d="M3.65297 10.236L6.45155 5.35205C6.75488 4.82269 8.60493 4.04441 8.632 4.03497C8.80397 3.94932 10.6165 3.05954 11.3493 3.02552C11.9938 2.9956 13.2235 3.36279 13.7578 3.55012C16.1685 4.36116 21.4961 6.14497 23.5208 6.79187C26.4509 7.40149 27.2957 6.67363 29.4141 5.96264C32.0932 4.81244 37.7245 2.38347 38.8177 1.86919C39.8078 1.50978 41.2424 1.61891 41.6622 3.49914L43.1011 12.8074C44.2879 19.072 46.7513 32.2658 47.1103 34.9239C47.559 38.2466 47.1948 41.246 47.1851 42.8802C47.1833 44.3763 46.8993 44.4987 46.154 45.4262C45.8404 45.8739 45.2555 46.1233 45.0022 46.1921C43.5903 46.3336 40.2049 46.6513 37.9583 46.7897C36.307 46.9842 31.5057 46.8945 29.3115 46.8254L22.3146 46.5945L15.6627 46.6326C14.3531 46.7615 11.5099 47.0619 10.6135 47.2327C10.0841 47.2858 5.01084 48.7988 3.85184 49.2041C3.07804 49.5591 2.88016 49.075 2.87795 48.7886L2.41171 40.8932C2.19519 38.0363 1.66904 31.9126 1.29659 30.2733C0.730933 28.5233 1.83747 27.0899 3.09053 25.0276C4.34359 22.9652 4.9665 21.7537 4.98396 19.9815C4.56906 18.3416 3.64145 14.735 3.25019 13.4272C2.85893 12.1194 3.35569 10.7548 3.65297 10.236Z" fill="currentColor"/><path d="M19.8203 30.5293V22.3159H24.9707V23.3936H21.0682V25.878H24.6985V26.9444H21.0682V29.4516H25.0161V30.5293H19.8203Z" fill="white"/></g>
                <defs><clipPath id="clip0_e"><rect width="50" height="52" fill="white"/></clipPath></defs>
            </svg>
            <svg className="zone zone-n" width="50" height="61" viewBox="0 0 50 61" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => onZone(N_LAT_LNG, SECTION_ZOOM)}>
                <g clipPath="url(#clip0_n)"><path d="M18.4963 57.9305L2.0392 48.1799C1.50344 47.8623 1.58685 47.4036 1.69553 47.2139C3.76881 43.5958 8.08806 36.1251 8.77883 35.188C9.64229 34.0167 9.75179 34.7202 11.0982 33.377C12.1754 32.3025 14.3555 29.6683 15.3109 28.4856C16.9598 26.0554 20.9262 20.2965 23.6008 16.7025C26.9441 12.21 29.0943 7.67469 30.4202 6.2556C31.746 4.83651 34.7147 2.11595 38.8603 1.47954C43.0058 0.843131 45.9627 2.28114 47.1205 2.94459C48.0468 3.47535 47.8772 4.53169 47.6767 4.99351C47.2505 5.7746 46.0898 7.85228 44.857 9.91423C43.316 12.4917 45.2365 15.5146 46.0122 18.5224C46.6328 20.9287 46.0558 22.4351 45.6898 22.8875L42.2896 28.8213C42.1882 28.9982 42.1038 29.6376 42.5769 30.7803C43.1683 32.2086 44.2059 46.8372 44.3561 48.1409C44.4762 49.1838 44.1153 49.6049 43.9198 49.6852C43.1629 50.1486 41.1979 51.3039 39.3926 52.2176C37.1361 53.3598 34.8498 56.3432 32.5722 57.8577C30.2945 59.3722 28.225 59.8525 26.059 60.2775C24.3262 60.6175 20.2952 58.8545 18.4963 57.9305Z" fill="currentColor"/><path d="M32.9122 27.8072V36.0206H31.7664L27.603 30.0194H27.5349V36.0206H26.287V27.8072H27.4441L31.6076 33.8198H31.687V27.8072H32.9122Z" fill="white"/></g>
                <defs><clipPath id="clip0_n"><rect width="50" height="61" fill="white"/></clipPath></defs>
            </svg>
            <svg className="zone zone-w" width="70" height="36" viewBox="0 0 70 36" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => onZone(W_LAT_LNG, SECTION_ZOOM)}>
                <g clipPath="url(#clip0_w)"><path opacity="0.9" d="M64.886 24.2352C64.9887 25.5488 65.4519 27.9339 65.6706 28.9623L65.8539 29.6377C66.0159 30.2346 65.8219 30.6888 65.1773 30.8184C63.1055 31.0333 58.3619 31.49 55.9619 31.5976C51.4354 31.4516 42.0003 31.1543 40.472 31.1341C39.7599 31.1823 30.1506 30.733 25.4349 30.5023C23.1537 30.5021 18.0496 30.4766 15.883 30.3758C13.7165 30.275 11.5647 29.3272 10.7597 28.8659C8.86337 27.7792 4.76258 25.3724 3.52998 24.4379C0.771707 21.289 1.14315 18.6501 1.23661 17.4917C1.33006 16.3333 1.23116 15.635 4.70035 14.5574C8.16954 13.4797 10.3434 11.3034 10.6968 10.9355C11.0502 10.5677 14.1454 7.77866 17.93 6.02622C21.7146 4.27379 31.5686 2.0069 34.8985 1.91882C36.157 1.71317 44.9944 2.21475 47.2042 2.34017L47.2044 2.34018C48.8799 2.50177 52.465 2.40786 54.0481 2.3407C56.1428 2.21022 60.6867 1.95276 62.1046 1.96673C63.6266 2.09745 64.1945 3.71085 64.2881 4.50122C64.2968 5.8132 64.2966 8.94045 64.2267 10.9536C64.1393 13.47 64.7575 22.5932 64.886 24.2352Z" fill="currentColor"/><path d="M33.0705 20.3339L30.7902 12.1204H32.1062L33.7058 18.4734H33.7739L35.4415 12.1204H36.7348L38.4024 18.4734H38.4705L40.0701 12.1204H41.386L39.1058 20.3339H37.8465L36.1222 14.1965H36.0541L34.3297 20.3339H33.0705Z" fill="white"/></g>
                <defs><clipPath id="clip0_w"><rect width="70" height="36" fill="white"/></clipPath></defs>
            </svg>
        </div>
        <button type="button" className="btn-zone-full" onClick={() => onZone(DEFAULT_CENTER as [number, number], DEFAULT_ZOOM)}>전체 지도</button>
    </div>
);

const MapSearch = ({ buildings, cctvs }: { buildings: any; cctvs: any }) => {
    const [input, setInput] = useState('');
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<{ name: string; type: string; code: string; x: string; y: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = () => {
        if (!input.trim()) { setIsOpen(false); return; }
        setKeyword(input);
        const list: typeof results = [];
        const kw = input.replace(/\s/g, '').toLowerCase();

        buildings?.buildingItems?.forEach((b: any) => {
            if (b.facInfo.facName.replace(/\s/g, '').toLowerCase().includes(kw) || b.facInfo.facId.toLowerCase().includes(kw)) {
                list.push({ code: b.facInfo.facId, type: 'building', name: `${b.facInfo.facId} ${b.facInfo.facName}`, x: b.facInfo.xcoord, y: b.facInfo.ycoord });
            }
        });

        cctvs?.cctvItems?.forEach((c: any) => {
            if (c.facInfo.facName.replace(/\s/g, '').toLowerCase().includes(kw)) {
                list.push({ code: c.facInfo.facId, type: 'cctv', name: c.facInfo.facName, x: c.facInfo.xcoord, y: c.facInfo.ycoord });
            }
        });

        list.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR', { sensitivity: 'base', numeric: true }));
        setResults(list);
        setIsOpen(true);
    };

    return (
        <div className="gis__search active" style={{ left: 450, pointerEvents: 'auto' }}>
            <div className="input">
                <input
                    type="search"
                    placeholder="건물명, CCTV명 입력"
                    className="gis__search__input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                />
            </div>
            <button type="button" className="btn-search" onClick={handleSearch} />
            {isOpen && (
                <div className="result" style={{ display: 'block' }}>
                    <div className="result__head">총<span>{results.length}</span>건</div>
                    <div className="result__body">
                        <ul className="result__list">
                            {results.map((r) => (
                                <li key={r.code} className={`result__item result__item--${r.type}`}>
                                    <p>{r.name}</p>
                                </li>
                            ))}
                            {results.length === 0 && (
                                <div className="no-data">
                                    <p className="message"><span>'{keyword}'</span>에 대한 검색 결과가 없습니다.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                    <div className="result__footer">
                        <button type="button" onClick={() => setIsOpen(false)}>접기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── 메인 ── */
const GisMap = () => {
    const [activeTile, setActiveTile] = useState('SATELLITE');
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const mapRef = useRef<L.Map | null>(null);
    const isZoomed = zoom >= ZOOM_THRESHOLD;
    const buildings = useFacStore((s) => s.buildings);
    const cctvs = useFacStore((s) => s.cctvs);
    const activeLeftMenu = useCommonClientStore((s) => s.activeLeftMenu);
    const isCampusTab = activeLeftMenu === 'CAMPUS';
    const isEventTab = activeLeftMenu === 'EVENT';
    const isFavoriteTab = activeLeftMenu === 'FAVORITE';
    const isPatrolMode = usePatrolStore((s) => s.isPatrolMode);
    const isPatrolPlaying = usePatrolStore((s) => s.isPlaying);
    const patrolActions = usePatrolStore((s) => s.actions);
    const activePatrol = usePatrolStore((s) => s.activePatrol);
    const currentCctvIndex = usePatrolStore((s) => s.currentCctvIndex);
    const isCastMode = useEventStore((s) => s.isCastMode);
    const addCastCctv = useEventStore((s) => s.actions.addCastCctv);
    const castCctvs = useEventStore((s) => s.castCctvs);
    const cctvTypeFilter = useCampusStore((s) => s.cctvTypeFilter);
    const buildingAreaFilter = useCampusStore((s) => s.buildingAreaFilter);
    const events = useEventStore((s) => s.events);
    const activeEvent = useEventStore((s) => s.activeEvent);
    const setActiveEvent = useEventStore((s) => s.actions.setActiveEvent);
    const showBuildingMarkers = useCampusStore((s) => s.showBuildingMarkers);
    const showCctvMarkers = useCampusStore((s) => s.showCctvMarkers);
    const cctvFormMode = useCampusStore((s) => s.cctvFormMode);
    // 캠퍼스 store
    const campusState = useCampusStore(
        useShallow((s) => ({ activeBuilding: s.activeBuilding, setActiveBuilding: s.actions.setActiveBuilding, setHighlightCctvs: s.actions.setHighlightCctvs, selectedCctvs: s.selectedCctvs, setSelectedCctvs: s.actions.setSelectedCctvs, toggleSelectedCctv: s.actions.toggleSelectedCctv, setScrollTargetId: s.actions.setScrollTargetId }))
    );
    // 즐겨찾기 store
    const favorState = useFavoriteStore(
        useShallow((s) => ({ activeBuilding: s.activeBuilding, setActiveBuilding: s.actions.setActiveBuilding, setHighlightCctvs: s.actions.setHighlightCctvs, selectedCctvs: s.selectedCctvs, setSelectedCctvs: s.actions.setSelectedCctvs, toggleSelectedCctv: s.actions.toggleSelectedCctv }))
    );

    // 현재 탭에 따라 사용할 store 선택
    const activeBuilding = isFavoriteTab ? favorState.activeBuilding : campusState.activeBuilding;
    const setActiveBuilding = isFavoriteTab ? favorState.setActiveBuilding : campusState.setActiveBuilding;
    const setHighlightCctvs = isFavoriteTab ? favorState.setHighlightCctvs : campusState.setHighlightCctvs;
    const selectedCctvs = isFavoriteTab ? favorState.selectedCctvs : campusState.selectedCctvs;
    const setSelectedCctvs = isFavoriteTab ? favorState.setSelectedCctvs : campusState.setSelectedCctvs;
    const toggleSelectedCctv = isFavoriteTab ? favorState.toggleSelectedCctv : campusState.toggleSelectedCctv;
    const setScrollTargetId = campusState.setScrollTargetId;

    const isRightOpen = activeBuilding !== null || cctvFormMode !== 'NONE' || (isEventTab && activeEvent !== null);
    const RIGHT_PANEL_WIDTH = 528;

    const mask = useMemo(() => buildMaskFeature(), []);

    const buildingCctvs: CctvType[] = useMemo(() => {
        if (!activeBuilding || !cctvs) return [];
        return cctvs.cctvItems.filter((c) => c.building?.includes(activeBuilding.facInfo.facId));
    }, [activeBuilding, cctvs]);

    // 이벤트 탭: 활성 이벤트의 건물에 속한 CCTV + 수동 투망 CCTV
    const eventCctvs: CctvType[] = useMemo(() => {
        if (!isEventTab || !activeEvent || !cctvs) return [];
        const buildingCode = activeEvent.buildingCode;
        const buildingList = buildingCode
            ? cctvs.cctvItems.filter((c) => c.building?.includes(buildingCode))
            : [];
        const ids = new Set(buildingList.map((c) => c.facInfo.facId));
        const extra = castCctvs.filter((c) => !ids.has(c.facInfo.facId));
        return [...buildingList, ...extra];
    }, [isEventTab, activeEvent, cctvs, castCctvs]);

    const handleBuildingClick = useCallback(
        (b: BuildingType) => {
            const isSame = activeBuilding?.facInfo.facId === b.facInfo.facId;
            setSelectedCctvs([]); // 기존 CCTV 선택 초기화
            if (isSame) {
                setActiveBuilding(null);
                setHighlightCctvs([]);
            } else {
                setActiveBuilding(b);
                const filtered = cctvs?.cctvItems.filter((c) => c.building?.split('/').includes(b.facInfo.facId)) ?? [];
                setHighlightCctvs(filtered);
            }
            setScrollTargetId(`building-${b.facInfo.facId}`);
        },
        [activeBuilding, cctvs]
    );

    return (
        <>
        <section className="gis" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <MapContainer
                ref={mapRef}
                renderer={L.canvas()} zoomControl={false} zoom={DEFAULT_ZOOM} center={DEFAULT_CENTER}
                maxZoom={18} minZoom={11} attributionControl={false}
                scrollWheelZoom doubleClickZoom={false} closePopupOnClick={false}
                keyboard={false}
                style={{ width: '100%', height: '100%', zIndex: 1 }}
            >
                {activeTile === 'NORMAL' && <TileLayer url={TILES.NORMAL} />}
                {activeTile === 'SATELLITE' && (
                    <><TileLayer url={TILES.SATELLITE} /><TileLayer url={TILES.HYBRID} /></>
                )}

                <Pane name="mask" style={{ zIndex: 400 }}>
                    <GeoJSON data={mask} style={{ fillColor: 'black', fillOpacity: 0.5, stroke: false }} />
                </Pane>

                <Pane name="customTooltipPane" style={{ zIndex: 1100 }} />

                <Pane name="buildings" style={{ zIndex: 1005 }}>
                    {(isPatrolMode || ((isCampusTab || isFavoriteTab) && showBuildingMarkers)) && buildings?.buildingItems
                        .filter((b) => b.facInfo.ycoord && b.facInfo.xcoord)
                        .filter((b) => isPatrolMode ? true : (isFavoriteTab ? b.facInfo.isFavorite : true))
                        .filter((b) => isPatrolMode ? true : (buildingAreaFilter === 'whole' || b.area === buildingAreaFilter))
                        .map((b) => {
                            const isActive = activeBuilding?.facInfo.facId === b.facInfo.facId;
                            return (
                                <Marker key={b.facInfo.facId}
                                    position={[Number(b.facInfo.ycoord), Number(b.facInfo.xcoord)]}
                                    icon={buildingIcon(b.facInfo.facId, isActive)}
                                    eventHandlers={{ click: () => { if (!isPatrolMode) handleBuildingClick(b); } }}
                                >
                                    <Tooltip direction="top" offset={[0, -(isActive ? 62 : 26)]} pane="customTooltipPane">
                                        {b.facInfo.facName}
                                    </Tooltip>
                                </Marker>
                            );
                        })}
                </Pane>

                {/* CCTV 마커 */}
                <Pane name="cctvs" style={{ zIndex: 1010 }}>
                    {showCctvMarkers && cctvs?.cctvItems
                        .filter((c) => c.facInfo.ycoord && c.facInfo.xcoord)
                        .filter((c) => isFavoriteTab ? c.facInfo.isFavorite : true)
                        .filter((c) => isCampusTab ? (cctvTypeFilter === 'whole' || c.type === cctvTypeFilter) : true)
                        .map((c) => {
                            let showIdx = -1;

                            let isPatrolCurrent = false;
                            if (isPatrolMode) {
                                // 순찰 모드: 현재 재생 중인 CCTV 1개만 번호 마커 + pulse
                                if (isPatrolPlaying && activePatrol) {
                                    const patrolIdx = activePatrol.cctvMapps.findIndex(
                                        (pc) => pc.cctvInfo.facInfo.facId === c.facInfo.facId
                                    );
                                    if (patrolIdx >= 0 && patrolIdx === currentCctvIndex) {
                                        showIdx = currentCctvIndex;
                                        isPatrolCurrent = true;
                                    }
                                }
                            } else if (isCampusTab || isFavoriteTab) {
                                const highlightIdx = activeBuilding
                                    ? buildingCctvs.findIndex((bc) => bc.facInfo.facId === c.facInfo.facId)
                                    : -1;
                                const selectedIdx = selectedCctvs.findIndex((sc) => sc.facInfo.facId === c.facInfo.facId);
                                showIdx = highlightIdx >= 0 ? highlightIdx : (selectedIdx >= 0 ? selectedIdx : -1);
                            } else if (isEventTab) {
                                const evIdx = eventCctvs.findIndex((ec) => ec.facInfo.facId === c.facInfo.facId);
                                showIdx = evIdx >= 0 ? evIdx : -1;
                            }
                            const tooltipOffset = showIdx >= 0 ? -32 : (isZoomed ? -24 : -12);

                            return (
                                <Marker key={c.facInfo.facId}
                                    position={[Number(c.facInfo.ycoord), Number(c.facInfo.xcoord)]}
                                    icon={cctvIcon(c.type, showIdx, isZoomed, isPatrolCurrent)}
                                    eventHandlers={{
                                        click: () => {
                                            // 순찰 모드: 클릭 무시
                                            if (isPatrolMode) return;
                                            // 캠퍼스/즐겨찾기 탭: 건물 미선택 시 다중선택
                                            if ((isCampusTab || isFavoriteTab) && !activeBuilding) {
                                                toggleSelectedCctv(c);
                                                setScrollTargetId(`cctv-${c.facInfo.facId}`);
                                            }
                                            // 이벤트 탭: 수동 투망 모드일 때만 클릭 가능
                                            if (isEventTab && isCastMode) {
                                                addCastCctv(c);
                                            }
                                        }
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, tooltipOffset]} pane="customTooltipPane">
                                        {c.facInfo.facName}
                                    </Tooltip>
                                </Marker>
                            );
                        })}
                </Pane>

                {/* 이벤트 마커 */}
                <Pane name="events" style={{ zIndex: 1015 }}>
                    {events?.events
                        ?.filter((e) => e.buildingCode)
                        .filter((e) => {
                            if (isEventTab) return true;
                            // 캠퍼스/즐겨찾기: 오늘 발생 + 미해제만
                            if (e.clearedAt !== null) return false;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const occurred = new Date(e.occurredAt);
                            return occurred >= today;
                        })
                        .map((e) => {
                            const building = buildings?.buildingItems.find((b) => b.facInfo.facId === e.buildingCode);
                            if (!building?.facInfo.ycoord || !building?.facInfo.xcoord) return null;
                            const isActive = activeEvent?.id === e.id;
                            return (
                                <Marker key={`event-${e.id}`}
                                    position={[Number(building.facInfo.ycoord), Number(building.facInfo.xcoord)]}
                                    icon={eventIcon(e.type, isActive, e.buildingCode ?? '', building.facInfo.facName)}
                                    eventHandlers={{
                                        click: () => {
                                            // 순찰 모드: 클릭 무시
                                            if (isPatrolMode) return;
                                            if (!isEventTab) {
                                                useCommonClientStore.getState().actions.setActiveLeftMenu('EVENT');
                                            }
                                            setActiveEvent(isActive ? null : e);
                                        },
                                    }}
                                />
                            );
                        })}
                </Pane>

                <MapController activeBuilding={activeBuilding} />
                <ZoomSync onChange={setZoom} />
                <ZoomControl zoom={zoom} rightOffset={isRightOpen ? RIGHT_PANEL_WIDTH : 0} />
            </MapContainer>
            <TileControl activeTile={activeTile} onChange={setActiveTile} rightOffset={isRightOpen ? RIGHT_PANEL_WIDTH : 0} />
            <MapLegend rightOffset={isRightOpen ? RIGHT_PANEL_WIDTH : 0} />
        </section>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
            <MapSearch buildings={buildings} cctvs={cctvs} />
            <div style={{ pointerEvents: 'auto', position: 'absolute', bottom: 44, left: 450 }}>
                <SectionZone onZone={(center, z) => mapRef.current?.flyTo(center, z, { duration: 0.5 })} />
            </div>
            <button
                type="button"
                className={`btn-patrol ${isPatrolMode ? 'active' : ''}`}
                style={{ pointerEvents: 'auto', position: 'absolute', top: 20, right: 140 + (isRightOpen ? RIGHT_PANEL_WIDTH : 0), transition: 'right 550ms ease', zIndex: 10 }}
                onClick={() => { console.log('patrol click, current:', isPatrolMode); patrolActions.setPatrolMode(!isPatrolMode); }}
            >순찰모드</button>
            {isCastMode && <div className="toast-tooltip">지도에서 CCTV를 선택하면 우측 패널에 추가됩니다.</div>}
            {isPatrolPlaying && <PatrolPlayer />}
        </div>
        </>
    );
};

export default GisMap;
