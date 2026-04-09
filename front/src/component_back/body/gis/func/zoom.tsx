import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";

const Zoom = () => {

    const {activeZoom, setActiveZoom} = useGisStore(useShallow((state)=> ({
        activeZoom : state.activeZoom,
        setActiveZoom : state.actions.setActiveZoom
    })))

    return(
        <div className="gis__controller ">
            <div className="frame frame--zoom">
                <button type="button" className={`btn__zoom btn__zoom--plus`} disabled={activeZoom === 13} onClick={()=>setActiveZoom(activeZoom+1)}/>
                <button type="button" className={`btn__zoom btn__zoom--minus`} disabled={activeZoom === 4} onClick={()=>setActiveZoom(activeZoom-1)}/>
            </div>
        </div>
    )

}
export default Zoom