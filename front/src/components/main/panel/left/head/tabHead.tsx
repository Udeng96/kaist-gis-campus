import {useCommonStore} from "../../../../../api/data/common.ts";
import {useShallow} from "zustand/react/shallow";
import {useCommonClientStore} from "../../../../../data/common.ts";

const TabHead = () => {

    const leftTabTypes = useCommonStore((state)=> state.leftTab);
    const {activeLeftMenu, setActiveLeftMenu, activeAlarm, setActiveAlarm} = useCommonClientStore(useShallow((state)=> ({
        activeLeftMenu : state.activeLeftMenu,
        setActiveLeftMenu : state.actions.setActiveLeftMenu,
        activeAlarm : state.activeAlarm,
        setActiveAlarm :state.actions.setActiveAlarm
    })))
    return(
        <div className="content__head">
            <div className="frame">
                <h2 className="content__title">GIS 대시보드</h2>
                <button type="button" className="toggle">
                    <input type="checkbox" className="toggle__checkbox" checked={activeAlarm} onChange={()=> setActiveAlarm(!activeAlarm)}/>
                    <div className="toggle__circle"></div>
                    <span className="toggle__text"></span>
                    <div className="toggle__layer"></div>
                </button>
            </div>
            <div className="btn-tab__wrap">
                {
                    leftTabTypes.map((leftTab) => (
                        <button key={`left_tab_${leftTab.code}`} type="button"
                                onClick={() => setActiveLeftMenu(leftTab.code)}
                                className={`btn-tab ${activeLeftMenu === leftTab.code ? 'active' : ''}`}>{leftTab.name}</button>
                    ))
                }
            </div>
        </div>
    )


}

export default TabHead