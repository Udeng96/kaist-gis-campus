import Search from "./search/search.tsx";
import Func from "./func/Func.tsx";
import Legend from "./legend/legend.tsx";
import Map from "./map/map.tsx";
import PatrolPlayerBox from "./player/patrolPlayerBox.tsx";

const Gis = () => {


    return (
        <section className="gis">
            <div className="gis__in">
                <Map/>
            </div>
            <Search/>
            <Func/>
            <Legend/>
            <PatrolPlayerBox/>
        </section>
    )


}

export default Gis
