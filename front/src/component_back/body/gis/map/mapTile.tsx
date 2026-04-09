import {TileLayer} from "react-leaflet";
import {TILE_MAP_VWORLD, TILE_TYPE_NORM, TILE_TYPE_SATEL} from "../../../../data_back/const/gis.ts";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";

const MapTile = () => {

    const {activeTile} = useGisStore(useShallow((state)=> ({
        activeTile : state.activeTile,
    })))

    return(
        <>
            {
                activeTile === TILE_TYPE_NORM && (
                    <TileLayer key={`TILE_LAYER_BROAD_NORMAL`} url={TILE_MAP_VWORLD["NORMAL"].url}/>
                )
            }
            {
                activeTile === TILE_TYPE_SATEL && (
                    <>
                        <TileLayer key={`TILE_LAYER_BROAD_SATELLITE`} url={TILE_MAP_VWORLD["SATELLITE"].url} />
                        <TileLayer key={`TILE_LAYER_BROAD_HYBRID`} url={TILE_MAP_VWORLD["HYBRID"].url}/>
                    </>
                )
            }

        </>
    )

}

export default MapTile