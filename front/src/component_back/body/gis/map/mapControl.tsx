import {useMap, useMapEvents} from "react-leaflet";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useRef} from "react";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {SECTION_ZOOM_LEVEL} from "../../../../data_back/const/gis.ts";

const MapControl = () => {

    const map = useMap();
    const {activeCenter, setActiveCenter, activeZoom, setActiveZoom} = useGisStore(useShallow((s) => ({
        activeCenter: s.activeCenter,
        setActiveCenter: s.actions.setActiveCenter,
        activeZoom: s.activeZoom,
        setActiveZoom: s.actions.setActiveZoom
    })));
    const {activeBuilding} = useLeftStore(useShallow((state) => ({
        activeBuilding: state.activeBuilding
    })));

    // Flag to avoid feedback loop on zoomend when we change zoom programmatically
    const applyingZoomRef = useRef(false);
    const clearApplyingZoom = () => { applyingZoomRef.current = false; };

    // Apply zoom changes from store (only when different)
    useEffect(() => {
        const currentZoom = map.getZoom();
        if (currentZoom === activeZoom) return;

        applyingZoomRef.current = true;
        map.setZoom(activeZoom, { animate: true });
        // Clear the flag shortly after zoom change
        const t = setTimeout(clearApplyingZoom, 300);
        return () => clearTimeout(t);
    }, [map, activeZoom]);

    // Focus building without manually setting store zoom (zoomend will update it)
    useEffect(() => {
        if (!activeBuilding) return;
        setActiveZoom(SECTION_ZOOM_LEVEL);
        setTimeout(()=>{
            setActiveCenter([Number(activeBuilding.ycrdnt), Number(activeBuilding.xcrdnt)]);
        },100)
    }, [map, activeBuilding]);

    useEffect(() => {
        applyingZoomRef.current = true;
        map.flyTo(
            [Number(activeCenter[0]), Number(activeCenter[1])],
            activeZoom,
            { animate: false }
        );
        const t = setTimeout(clearApplyingZoom, 400);
        return () => clearTimeout(t);
    }, [activeCenter, activeZoom]);

    useMapEvents({
        zoomend: (e) => {
            if (applyingZoomRef.current) return;
            const z = map.getZoom();
            if (z !== activeZoom) {
                setActiveZoom(z);
                setActiveCenter([Number(e.target.getCenter().lat), Number(e.target.getCenter().lng)]);
            }
        },
        dragend: () => {
            const center = map.getCenter();
            setActiveCenter([center.lat, center.lng]);
        }
    });

    return null;

}

export default MapControl