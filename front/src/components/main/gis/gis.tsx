import { useState, useEffect, useMemo, useCallback } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, Pane, useMap, useMapEvents } from "react-leaflet";
import { useShallow } from "zustand/react/shallow";
import "leaflet/dist/leaflet.css";
import type { Feature } from "geojson";
import { useFacStore } from "../../../api/data/fac";
import { useCampusStore } from "../../../data/campus";
import type { BuildingType, CctvType } from "../../../api/types/facTypes";

/* ── 상수 ── */
const isDev = process.env.NODE_ENV === "development";
const VWORLD = isDev ? "https://xdworld.vworld.kr" : "/vworld";

const TILES = {
    NORMAL:    `${VWORLD}/2d/Base/service/{z}/{x}/{y}.png`,
    SATELLITE: `${VWORLD}/2d/Satellite/service/{z}/{x}/{y}.jpeg`,
    HYBRID:    `${VWORLD}/2d/Hybrid/service/{z}/{x}/{y}.png`,
};

const DEFAULT_CENTER: [number, number] = [36.3708652593293, 127.36311639872487];
const DEFAULT_ZOOM = 16;
const SECTION_ZOOM = 17;

const WORLD_GEOJSON: [number, number][] = [
    [124, 32], [132, 32], [132, 40], [124, 40], [124, 32],
];
const KAIST_GEOJSON: [number, number][] = [
    [127.35632208232607,36.3763380468086],[127.3572929684363,36.37618170703631],[127.35820837534101,36.37618170703631],
    [127.35934569907147,36.37613703847211],[127.35967857431012,36.376092369882215],[127.36048302280193,36.37600303262559],
    [127.36114877327913,36.37598069829575],[127.36198096137275,36.37593602961611],[127.3622028781985,36.37589136091081],
    [127.36295184748491,36.375668016999555],[127.3634788999455,36.375668016999555],[127.36381177518223,36.375802023423276],
    [127.36555937018244,36.375467006931515],[127.3665025166909,36.374707630875534],[127.36716826716622,36.37381423778879],
    [127.36750114240482,36.372742152540326],[127.36783401764347,36.37184873688031],[127.36805593446917,36.37086596780331],
    [127.36888812256274,36.37039691454862],[127.3698312690712,36.36983851413025],[127.37019188391355,36.36939179090976],
    [127.36974805026205,36.36907908312868],[127.36913777899218,36.36872170126914],[127.36813915327832,36.3680292692445],
    [127.36739018399197,36.36747085183286],[127.36619738105594,36.36671139772049],[127.36533745335669,36.366130633691924],
    [127.36350663954727,36.36534882911606],[127.3622028781985,36.364790392467256],[127.36073267923138,36.36398623665218],
    [127.35987275153212,36.36340545228384],[127.35912378224572,36.36360649351714],[127.35845803177045,36.364701042231346],
    [127.3579587189135,36.36552752799763],[127.35737618724738,36.366421016248054],[127.35676591597758,36.36731449423867],
    [127.35604468629487,36.36834198124426],[127.35554537343796,36.369146092045085],[127.35521249819936,36.369905522391846],
    [127.35512927939016,36.37077662454416],[127.35521249819936,36.371402025202585],[127.35554537343796,36.371893407907066],
    [127.35621112391334,36.372228439789],[127.35626660312062,36.372250775196946],[127.35637756153159,36.372652811435884],
    [127.35615564470777,36.37354621786143],[127.3562174815815,36.374305605256325],[127.35625559585469,36.37527827142931],
    [127.35624734040641,36.37637708712387],
];

/* ── 마스크 GeoJSON ── */
const buildMaskFeature = (): Feature => ({
    type: "Feature",
    geometry: {
        type: "Polygon",
        coordinates: [
            [...WORLD_GEOJSON],
            [...KAIST_GEOJSON].reverse(),
        ],
    },
    properties: {},
});

/* ── 건물 아이콘 (레거시 CSS: .gis__icon.building) ── */
const buildingIcon = (code: string, isActive: boolean) => {
    const size: [number, number] = isActive ? [45, 62] : [26, 26];
    return L.divIcon({
        className: "building_icon",
        html: `<button class="gis__icon-wrap"><i class="gis__icon building ${isActive ? "active" : ""}"></i><div class="name">${code}</div></button>`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],  // 중앙 하단
    });
};

/* ── CCTV 아이콘 (레거시 CSS: .gis__icon.cctv-in / cctv-out / cctv-flame) ── */
const cctvIcon = (type: string, idx: number) => {
    const typeClass = type === "IN" ? "in" : type === "OUT" ? "out" : "flame";
    return L.divIcon({
        className: "cctv_icon",
        html: `<button class="gis__icon-wrap"><i class="gis__icon cctv-${typeClass}"></i><div class="num">${idx + 1}</div></button>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],  // 중앙 하단
    });
};

/* ── 맵 이벤트 핸들러 (줌/포커스) ── */
const MapController = ({ activeBuilding }: { activeBuilding: BuildingType | null }) => {
    const map = useMap();

    useEffect(() => {
        if (activeBuilding) {
            const { xcoord, ycoord } = activeBuilding.facInfo;
            if (ycoord && xcoord) {
                map.flyTo([Number(ycoord), Number(xcoord)], SECTION_ZOOM, { duration: 0.5 });
            }
        }
    }, [activeBuilding]);

    return null;
};

/* ── 줌 컨트롤 UI ── */
const ZoomControl = () => {
    const map = useMap();
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);

    useMapEvents({
        zoomend: () => setZoom(map.getZoom()),
    });

    return (
        <div className="gis-zoom" style={{ position: "absolute", right: 16, bottom: 100, zIndex: 1000 }}>
            <button onClick={() => map.zoomIn()} disabled={zoom >= 18}>+</button>
            <button onClick={() => map.zoomOut()} disabled={zoom <= 11}>−</button>
        </div>
    );
};

/* ── 타일 전환 UI ── */
const TileControl = ({ activeTile, setActiveTile }: { activeTile: string; setActiveTile: (t: string) => void }) => (
    <div className="gis-tile-control" style={{ position: "absolute", right: 16, bottom: 180, zIndex: 1000 }}>
        <button className={activeTile === "NORMAL" ? "active" : ""} onClick={() => setActiveTile("NORMAL")}>일반</button>
        <button className={activeTile === "SATELLITE" ? "active" : ""} onClick={() => setActiveTile("SATELLITE")}>위성</button>
    </div>
);

/* ── 메인 GIS 컴포넌트 ── */
const Gis = () => {
    const [activeTile, setActiveTile] = useState("SATELLITE");

    const buildings = useFacStore((s) => s.buildings);
    const cctvs = useFacStore((s) => s.cctvs);

    const { activeBuilding, setActiveBuilding, highlightCctvs } = useCampusStore(
        useShallow((s) => ({
            activeBuilding: s.activeBuilding,
            setActiveBuilding: s.actions.setActiveBuilding,
            highlightCctvs: s.highlightCctvs,
        }))
    );

    const mask = useMemo(() => buildMaskFeature(), []);

    /* 건물 선택 시 해당 건물의 CCTV 필터 */
    const buildingCctvs: CctvType[] = useMemo(() => {
        if (!activeBuilding || !cctvs) return [];
        const bid = activeBuilding.facInfo.facId;
        return cctvs.cctvItems.filter((c) => c.building?.includes(bid));
    }, [activeBuilding, cctvs]);

    const handleBuildingClick = useCallback(
        (building: BuildingType) => {
            const isSame = activeBuilding?.facInfo.facId === building.facInfo.facId;
            setActiveBuilding(isSame ? null : building);
        },
        [activeBuilding]
    );

    return (
        <section className="gis">
            <MapContainer
                renderer={L.canvas()}
                zoomControl={false}
                zoom={DEFAULT_ZOOM}
                center={DEFAULT_CENTER}
                maxZoom={18}
                minZoom={11}
                attributionControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
                closePopupOnClick={false}
                style={{ width: "100%", height: "100%", zIndex: 1 }}
            >
                {/* 타일 레이어 */}
                {activeTile === "NORMAL" && <TileLayer url={TILES.NORMAL} />}
                {activeTile === "SATELLITE" && (
                    <>
                        <TileLayer url={TILES.SATELLITE} />
                        <TileLayer url={TILES.HYBRID} />
                    </>
                )}

                {/* 캠퍼스 마스크 */}
                <Pane name="mask" style={{ zIndex: 400 }}>
                    <GeoJSON data={mask} style={{ fillColor: "black", fillOpacity: 0.5, stroke: false }} />
                </Pane>

                {/* 툴팁 Pane (마커보다 z-index 높게) */}
                <Pane name="customTooltipPane" style={{ zIndex: 1100 }} />

                {/* 건물 마커 */}
                <Pane name="buildings" style={{ zIndex: 1005 }}>
                    {buildings?.buildingItems
                        .filter((b) => b.facInfo.ycoord && b.facInfo.xcoord)
                        .map((b) => {
                            const isActive = activeBuilding?.facInfo.facId === b.facInfo.facId;
                            const markerH = isActive ? 62 : 26;
                            return (
                                <Marker
                                    key={b.facInfo.facId}
                                    position={[Number(b.facInfo.ycoord), Number(b.facInfo.xcoord)]}
                                    icon={buildingIcon(b.facInfo.facId, isActive)}
                                    eventHandlers={{ click: () => handleBuildingClick(b) }}
                                >
                                    <Tooltip direction="top" offset={[0, -markerH]} pane="customTooltipPane">
                                        {b.facInfo.facName}
                                    </Tooltip>
                                </Marker>
                            );
                        })}
                </Pane>

                {/* CCTV 마커 (건물 선택 시) */}
                <Pane name="cctvs" style={{ zIndex: 1010 }}>
                    {buildingCctvs.map((c, idx) => (
                        <Marker
                            key={c.facInfo.facId}
                            position={[Number(c.facInfo.ycoord), Number(c.facInfo.xcoord)]}
                            icon={cctvIcon(c.type, idx)}
                        >
                            <Tooltip direction="top" offset={[0, -24]} pane="customTooltipPane">
                                {c.facInfo.facName}
                            </Tooltip>
                        </Marker>
                    ))}
                </Pane>

                {/* 맵 컨트롤 */}
                <MapController activeBuilding={activeBuilding} />
                <ZoomControl />
            </MapContainer>

            {/* 타일 전환 (MapContainer 밖) */}
            <TileControl activeTile={activeTile} setActiveTile={setActiveTile} />
        </section>
    );
};

export default Gis;
