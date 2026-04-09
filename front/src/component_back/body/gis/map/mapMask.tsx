import {  GeoJSON } from "react-leaflet";
import {KAIST_GEOJSON, WORLD_GEOJSON} from "../../../../data_back/const/gis.ts";
import type {Feature} from "geojson";
import {useEffect, useState} from "react";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
const MapMask = () => {

    const {activeZoom, activeCenter} = useGisStore(useShallow((state)=>({
        activeCenter : state.activeCenter,
        activeZoom : state.activeZoom,
    })))
    const [mask, setMask] = useState<Feature | null>(null);

    // KAIST 영역을 제외한 나머지 영역을 어둡게 만들기 위한 큰 사각형
    const buildMask = () => {
        const newMask: Feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    [...WORLD_GEOJSON],          // 외곽
                    [...KAIST_GEOJSON].reverse() // 구멍 (KAIST) ← 반시계
                ],
            },
            properties: {}
        };
        setMask(newMask);
    };

    useEffect(() => {
        // 초기 마스크 생성
        buildMask();
    }, [activeZoom, activeCenter]);

    if (!mask) return null;

    return (
        <>
            {/* 전체 영역을 어둡게 */}
            <GeoJSON
                data={mask}
                style={{
                    fillColor: "black",
                    fillOpacity: 0.5,
                    stroke: false,
                }}
            />
            {/* KAIST 영역을 밝게 (투명하게) */}
            <GeoJSON
                data={mask}
                style={{
                    fillColor: "transparent",
                    fillOpacity: 0,
                    stroke: false,
                }}
            />
        </>
    );
};


export default MapMask