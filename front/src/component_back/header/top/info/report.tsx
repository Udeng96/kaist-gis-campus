import {useMainStore} from "../../../../store_back/zustand/main.ts";

const Report = () => {

    const report = useMainStore((state)=> state.report);
    return(
        <div className="marquee">
            <p>{report ?report.content : '특보 없음'}</p>
        </div>
    )

}

export default Report