import {useCampusStore} from "../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";
import CctvTab from "../common/cctvTab.tsx";
import EventTab from "./eventTab.tsx";

const CampusBody = () => {

    const {highlightCctvs, rightTab} = useCampusStore(useShallow((state)=> ({
        highlightCctvs : state.highlightCctvs,
        rightTab : state.rightTab
    })))



    return(
        <div className={"content__body"}>
            <ul>
                {
                    rightTab === 'CCTV' && <CctvTab cctvs={highlightCctvs}/>
                }
                {
                    rightTab === 'EVENT' && <EventTab/>
                }

            </ul>
        </div>
    )

}

export default CampusBody