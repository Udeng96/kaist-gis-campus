import {TILE_TYPE_NORM, TILE_TYPE_SATEL} from "../../../../data_back/const/gis.ts";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";

const MapType = () => {

    const {activeTile, setActiveTile } =useGisStore(useShallow((state)=>({
        activeTile : state.activeTile,
        setActiveTile : state.actions.setActiveTile
    })))

    return(
        <div className="gis__map ">
            <button type="button" className={`btn__gis-type btn__gis-type--2d ${activeTile=== TILE_TYPE_NORM ? "active" : ""}`} onClick={()=>setActiveTile(TILE_TYPE_NORM)}>일반</button>
            <button type="button" className={`btn__gis-type btn__gis-type--3d ${activeTile === TILE_TYPE_SATEL ? "active" : ""}`} onClick={()=>setActiveTile(TILE_TYPE_SATEL)}>위성</button>
        </div>
    )

}

export default MapType