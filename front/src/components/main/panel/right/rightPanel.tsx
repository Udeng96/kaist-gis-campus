import RightCampus from "./campus/rightCampus.tsx";
import {useEffect, useState} from "react";
import {useCommonClientStore} from "../../../../data/common.ts";
import {useCampusStore} from "../../../../data/campus.ts";

const RightPanel = () => {
    const [rightActive, setRightActive] = useState<string>('');
    const activeLeftMenu = useCommonClientStore().activeLeftMenu;
    const activeBuilding = useCampusStore().activeBuilding;

    useEffect(() => {
        if(activeLeftMenu == 'CAMPUS'){
            if(activeBuilding !== null){
                setRightActive('active');
            }else{
                setRightActive('');
            }
        }
    }, [activeLeftMenu, activeBuilding]);


    return(
        <section className={`content content--right ${rightActive}`}>
            <div className="dimmed"></div>
            {
                activeLeftMenu === 'CAMPUS' && <RightCampus/>
            }

        </section>
    )
}

export default RightPanel