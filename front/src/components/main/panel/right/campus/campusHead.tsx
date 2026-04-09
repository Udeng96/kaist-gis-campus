import {useCampusStore} from "../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";

const CampusHead = () => {
    const {activeBuilding, rightTab, setRightTab} = useCampusStore(useShallow((state)=>({
        activeBuilding : state.activeBuilding,
        rightTab : state.rightTab,
        setRightTab : state.actions.setRightTab
    })));

    useEffect(() => {
        setRightTab('CCTV');
    }, [activeBuilding]);

    return (
        <div className="content__head">
            <div className="frame">
                <h2 className="content__title content__title--building">{activeBuilding ?  activeBuilding.facInfo.facName : ''} 상세보기</h2>
                {
                    rightTab === 'CCTV' && <button type="button" className={"btn-refresh"}>새로고침<i></i></button>
                }
            </div>
            <div className="btn-tab__wrap">
                <button type="button" className={`btn-tab ${rightTab === 'CCTV' ? 'active' : ''}`} onClick={()=>setRightTab('CCTV')}>CCTV</button>
                <button type="button" className={`btn-tab ${rightTab === 'EVENT' ? 'active' : ''}`} onClick={()=>setRightTab('EVENT')}>이벤트 내역</button>
            </div>
        </div>
    )

}

export default CampusHead