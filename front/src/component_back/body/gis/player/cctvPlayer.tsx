import * as React from "react";
import {useEffect, useRef} from "react";
import {useGisStore} from "../../../../store_back/zustand/gis";
import type {CCTV_TYPE} from "../../../../data_back/interface/leftInterface";
import L, {type LatLngExpression} from "leaflet";
import {Marker, Polyline, useMap} from "react-leaflet";
import {CCTV_TYPE_FLAME, CCTV_TYPE_IN, CCTV_TYPE_OUT, LEFT_MENU_CAMPUS} from "../../../../data_back/const/common";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useFavoriteStore} from "../../../../store_back/zustand/favorite.ts";

const CctvPlayer =  React.memo(({ cctv, idx }: { cctv: CCTV_TYPE, idx:number,  })  => {
    const map = useMap();
    const markerRef = useRef(null);
    const acitveTab = useLeftStore((state)=> state.activeTab);
    const dragFavorPos = useGisStore(state => state.favorDragPositions[cctv.streamId]);
    const dragPos = useGisStore(state => state.dragPositions[cctv.streamId]);
    const setFavorDrag = useGisStore(state => state.actions.setFavorDragPosition);
    const setDrag = useGisStore(state => state.actions.setDragPosition);
    const setRemoveStreamId = useGisStore(state=> state.actions.setRemoveStreamId);

    //@ts-ignore
    const activeZoom = useGisStore(state => state.activeZoom);
    const setExpandStreamId = useGisStore(state=>state.actions.setExpandStreamId);
    const setFavorStreamId = useGisStore(state=>state.actions.setFavorStreamId);
    const favorites = useFavoriteStore(state=> state.favorites)

    const pos: LatLngExpression = dragPos
        ? [dragPos.lat, dragPos.lng]
        : [Number(cctv.ycrdnt), Number(cctv.xcrdnt)];

    const favorPos: LatLngExpression = dragFavorPos
    ? [dragFavorPos.lat, dragFavorPos.lng]
        :[Number(cctv.ycrdnt), Number(cctv.xcrdnt)];

    const setCctvType = (plcType: string) => {
        if (plcType === CCTV_TYPE_IN.id) return CCTV_TYPE_IN.cd;
        if (plcType === CCTV_TYPE_OUT.id) return CCTV_TYPE_OUT.cd;
        return CCTV_TYPE_FLAME.cd;
    };

    useEffect(() => {
        const root = document.getElementById("root");
        if (!root) return;

        const onClick = (e: any) => {
            const closeBtn = e.target.closest(".btn-close");
            if (closeBtn) {
                const id = closeBtn.dataset.streamId;
                setRemoveStreamId(id);
                return;
            }
            const expandBtn = e.target.closest(".btn-expand");
            if (expandBtn) {
                const id = expandBtn.dataset.streamId;
                setExpandStreamId(id);
            }

            const favorBtn = e.target.closest(".btn-player-favorites");
            if (favorBtn) {
                const id = favorBtn.dataset.streamId;
                setFavorStreamId(id);
            }
        };

        root.addEventListener("click", onClick);
        return () => root.removeEventListener("click", onClick);
    }, []);


    const createIcon = () =>
        L.divIcon({
            html: `
            <div class="cctv__layer cctv__layer--${setCctvType(cctv.plcType)}">
                <div class="cctv__layer__head">
                    <div class="frame">
                        <div class="num">${idx+1}</div>
                        <p>${cctv.cctvNm}</p>
                    </div>
                    <button class="btn-player-favorites ${favorites.has(cctv.streamId) ? "active" : ""}" data-stream-id="${cctv.streamId}"></button>
                    <button 
                        class="btn-close" 
                        data-stream-id="${cctv.streamId}">
                    </button>
                </div>

                <div class="cctv__layer__body">
                    <div class="cctv__in" id="cctv-player-${cctv.streamId}">
                        
                    </div>
                    <button class="btn-expand" data-stream-id="${cctv.streamId}"></button>
                </div>
            </div>
        `,
            className: "",
            pane: "cctvPlayer",
            iconSize: [130, 100],
            iconAnchor: [40, 40],
        });


    useEffect(() => {
        const updateZoom = () => {
            useGisStore.setState({activeZoom: map.getZoom()});
        };

        map.on("zoom", updateZoom);
        map.on("move", updateZoom);

        return () => {
            map.off("zoom", updateZoom);
            map.off("move", updateZoom);
        };
    }, [map]);

    const getPlayerCenterLatLng = () => {
        const base = acitveTab.cd === LEFT_MENU_CAMPUS.cd ?  L.latLng(
            dragPos ? dragPos.lat : Number(cctv.ycrdnt),
            dragPos ? dragPos.lng : Number(cctv.xcrdnt)
        ) : L.latLng(
            dragFavorPos ? dragFavorPos.lat : Number(cctv.ycrdnt),
            dragFavorPos ? dragFavorPos.lng : Number(cctv.xcrdnt)
        );

        const iconWidth = 130;
        const iconHeight = 100;
        const anchorX = 65;
        const anchorY = 50;

        let offsetX = (iconWidth / 2) - anchorX + 50;
        let offsetY = (iconHeight / 2) - anchorY + 20;

        const basePoint = map.latLngToLayerPoint(base);
        return map.layerPointToLatLng(basePoint.add([offsetX, offsetY]));
    };

    const adjustedEnd = getPlayerCenterLatLng();

    const getColor = (plcType: string) => {
        if (plcType === '2') return '#76D066';
        if (plcType === '1') return '#3B82F6';
        return '#907AFF';
    };

    return (
        <>
            <Marker
                ref={markerRef}
                icon={createIcon()}
                position={acitveTab.cd === LEFT_MENU_CAMPUS.cd ? pos : favorPos}
                draggable
                pane="cctvPlayer"
                eventHandlers={{
                    dragstart: (e) => {
                        const icon = e.target._icon as HTMLElement;
                        icon.style.zIndex = "99999";   // 🔥 최상단으로 올리기
                        icon.style.position = "relative";
                        icon.style.transform = "scale(1.05)";  // 살짝 확대
                    },
                    dragend: (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        if(acitveTab.cd === LEFT_MENU_CAMPUS.cd){
                            setDrag(cctv.streamId, { lat, lng });
                        }else{
                            setFavorDrag(cctv.streamId, {lat,lng})
                        }

                        const icon = e.target._icon as HTMLElement;
                        icon.style.zIndex = "";        // 복원
                        icon.style.transform = "";
                        icon.style.position = "";
                    }
                }}
            />

            {dragPos && (
                <>
                    <Polyline
                        pane="polylineBorderPane"
                        positions={[
                            [Number(cctv.ycrdnt), Number(cctv.xcrdnt)],
                            adjustedEnd
                        ]}
                        pathOptions={{color: "#ffffff", weight: 4, opacity: 0.85}}
                    />
`
                    <Polyline
                        pane="polylinePane"
                        positions={[
                            [Number(cctv.ycrdnt), Number(cctv.xcrdnt)],
                            adjustedEnd
                        ]}
                        pathOptions={{color: getColor(cctv.plcType), weight: 6}}
                    />
                </>
            )}

            {dragFavorPos && (
                <>
                    <Polyline
                        pane="polylineBorderPane"
                        positions={[
                            [Number(cctv.ycrdnt), Number(cctv.xcrdnt)],
                            adjustedEnd
                        ]}
                        pathOptions={{color: "#ffffff", weight: 4, opacity: 0.85}}
                    />
                    `
                    <Polyline
                        pane="polylinePane"
                        positions={[
                            [Number(cctv.ycrdnt), Number(cctv.xcrdnt)],
                            adjustedEnd
                        ]}
                        pathOptions={{color: getColor(cctv.plcType), weight: 6}}
                    />
                </>
            )}
        </>
    );
});

export default CctvPlayer;
