import {
    LEFT_MENU_CAMPUS,
    LEFT_MENU_EVENT,
    LEFT_MENU_FAVORITE,
    RIGHT_MOD_NONE,
    RIGHT_MOD_TAB,
    TOAST_TYPE
} from "../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";

const TabHead = () => {

    const {
        alarmOn,
        activeTab,
        setAlarmOn,
        setActiveTab,
        setActiveBuilding,
        selectCctvList,
        setSelectCctvList,
        setActiveBuildingCctvs,
    } = useLeftStore(useShallow((state) => ({
        alarmOn: state.alarmOn,
        activeTab: state.activeTab,
        setAlarmOn: state.actions.setAlarmOn,
        setActiveTab: state.actions.setActiveTab,
        setActiveBuilding: state.actions.setActiveBuilding,
        selectCctvList : state.selectCctvList,
        setSelectCctvList: state.actions.setSelectCctvList,
        setActiveBuildingCctvs: state.actions.setActiveBuildingCctvs,
    })));

    const {setActiveToast, activeRightMod} = useMainStore(useShallow((state) => ({
        setActiveToast: state.actions.setActiveToast,
        activeRightMod: state.activeRightMod,
    })));

    const deleteDragPosition = useGisStore(state => state.actions.deleteDragPosition);


    const handleToggle = () => {
        if (alarmOn) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '이벤트 알람 수신이 설정되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '이벤트 알람 수신이 해제되었습니다.'})
        }
        setAlarmOn(!alarmOn)
    }


    const LEFT_MENU_LIST = [LEFT_MENU_CAMPUS, LEFT_MENU_EVENT, LEFT_MENU_FAVORITE];

    const handleTab = (menu: { cd: string, nm: string }) => {
        if (activeRightMod.cd !== RIGHT_MOD_NONE.cd && activeRightMod.cd !== RIGHT_MOD_TAB.cd) {
            setActiveToast({cd: TOAST_TYPE.WARNING, msg: '편집 모드를 종료한 후 다시 시도해주세요.'})
        } else {
            if (menu.cd !== activeTab.cd) {
                if(activeTab.cd !== LEFT_MENU_FAVORITE.cd){
                    setActiveBuilding(null);
                    if(selectCctvList.length > 0){
                        selectCctvList.forEach((cctv) => {
                            deleteDragPosition(cctv.streamId);
                        })
                    }
                    setSelectCctvList([]);
                    setActiveBuildingCctvs([]);
                }
                setActiveTab(menu)
            }
        }
    }

    return (
        <div className="content__head">
            <div className="frame">
                <h2 className="content__title">GIS 대시보드</h2>
                <button type="button" className="toggle">
                    <input type="checkbox" className="toggle__checkbox" checked={alarmOn} onChange={handleToggle}/>
                    <div className="toggle__circle"></div>
                    <span className="toggle__text"></span>
                    <div className="toggle__layer"></div>
                </button>
            </div>
            <div className="btn-tab__wrap">
                {LEFT_MENU_LIST.map((menu) => (
                    <button key={`left_tab_${menu.cd}`} type="button"
                            className={`btn-tab ${menu.cd === activeTab.cd ? "active" : ""}`}
                            onClick={() => handleTab(menu)}>{menu.nm}</button>
                ))
                }
            </div>
        </div>
    )
}

export default TabHead