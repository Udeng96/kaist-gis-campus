import {useCommonStore} from "../../../../../../api/data/common.ts";
import {useFacStore} from "../../../../../../api/data/fac.ts";
import {useEffect, useState} from "react";
import CampusCctvBtn from "./campusCctvBtn.tsx";
import {useCampusStore} from "../../../../../../data/campus.ts";
import type {CctvType} from "../../../../../../api/types/facTypes.ts";
import {useShallow} from "zustand/react/shallow";

const CampusCctv = () => {
    const CCTV_TYPE_CODE = ["in", "out", "flame"];

    const cctvTypes = useCommonStore().cctvType;
    const cctvs = useFacStore().cctvs;
    const {activeBuilding, highlightCctvs, setHighlightCctvs} = useCampusStore(useShallow((state)=> ({
        activeBuilding : state.activeBuilding,
        highlightCctvs : state.highlightCctvs,
        setHighlightCctvs : state.actions.setHighlightCctvs
    })))

    const [filterCctvs, setfilterCctvs] = useState<CctvType[]>([]);
    const [activeType, setActiceType] = useState<string>('whole');

    useEffect(() => {
        if(cctvs && cctvs.totalCnt > 0){
           const filterByType = cctvs.cctvItems.filter((cctv)=> activeType === 'whole' || CCTV_TYPE_CODE[Number(activeType)-1].toLocaleUpperCase() === cctv.type);
           if(activeBuilding){
               setHighlightCctvs(filterByType.filter((cctv)=> cctv.building.split("/").includes(activeBuilding.facInfo.facId)));
               setfilterCctvs(filterByType.filter((cctv)=> !cctv.building.split("/").includes(activeBuilding.facInfo.facId)))
           }else{
               setfilterCctvs(filterByType);
           }
        }
    }, [cctvs, activeType, activeBuilding]);

    return(
        <>
            {}
            <div className="list__container">
                <p className="info">CCTV 다중 선택시, 선택 순서대로 번호 마커가 표시됩니다.</p>
                <div className="list list--cctv">
                    <div className="list__head">
                        <h3 className="list__title">CCTV 리스트<span>{cctvs? cctvs.totalCnt : 0}</span></h3>
                        <div className="list__map">지도 표출
                            <button type="button" className={`btn-map active`} ></button>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <button type="button" className={`btn-preset all ${activeType === 'whole' ? 'active' : ''}`} onClick={() => setActiceType('whole')}>전체</button>
                        {
                            cctvTypes.map((type)=>(
                                <button type="button" className={`btn-preset ${activeType === type.code ? 'active' : ''}`} onClick={() => setActiceType(type.code)}>{type.name.replace("CCTV", "")}</button>
                            ))
                        }
                    </div>
                    <div className={`list__body`}>
                        <ul className="ct-scroll">
                            {
                                activeBuilding &&
                                highlightCctvs.map((cctv,idx)=><CampusCctvBtn cctv={cctv} idx={idx}/>)
                            }
                            {
                                filterCctvs.map((cctv)=>(<CampusCctvBtn cctv={cctv} idx={-1}/>))
                            }
                        </ul>
                    </div>
                    <div className={`list__footer`}>
                        <button type="button" className="btn btn-normal btn-ic plus">CCTV 등록</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CampusCctv