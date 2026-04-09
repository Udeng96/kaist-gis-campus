import ONBOARD_ONE from "../../../../assets/image/img/img_onboarding-01_1920x1080.png";
import ONBOARD_TWO from "../../../../assets/image/img/img_onboarding-02_1920x1080.png";
import ONBOARD_THREE from "../../../../assets/image/img/img_onboarding-03_1920x1080.png";
import ONBOARD_FOUR from "../../../../assets/image/img/img_onboarding-04_1920x1080.png";
import {MODAL_NONE, MODAL_ON_BOARD} from "../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {useState} from "react";

const BoardMain = () => {

    const {activeModal, setActiveModal} = useMainStore(useShallow((state)=> ({
        activeModal : state.activeModal,
        setActiveModal : state.actions.setActiveModal
    })))

    const [activePage, setActivePage] = useState<number>(1);

    const handleCls = () => {
        setActiveModal(MODAL_NONE);
        setActivePage(1);
    }

    return (
        <section className={`onboarding ${activeModal.cd === MODAL_ON_BOARD.cd ? 'active' : ''}`}>
            <ul className="onboarding__list">
                <li className={`onboarding__item ${activePage===1 ? 'active' : ''}`}><img src={ONBOARD_ONE} alt="건물 조회 사용 가이드 이미지"/></li>
                <li className={`onboarding__item ${activePage===2 ? 'active' : ''}`}><img src={ONBOARD_TWO} alt="CCTV 조회 사용 가이드 이미지"/></li>
                <li className={`onboarding__item ${activePage===3 ? 'active' : ''}`}><img src={ONBOARD_THREE} alt="이벤트 사용 가이드 이미지"/></li>
                <li className={`onboarding__item ${activePage===4 ? 'active' : ''}`}><img src={ONBOARD_FOUR} alt="순찰 사용 가이드 이미지"/></li>
            </ul>

            <div className="pagination">
                <ul>
                    <li className={`pagination__item ${activePage===1 ? 'active' : ''}`} onClick={()=>setActivePage(1)}>
                        <div className="num ">1</div>
                        <div className="onboarding__tooltip">건물 조회 사용 가이드</div>
                    </li>
                    <li className={`pagination__item ${activePage===2 ? 'active' : ''}`} onClick={()=>setActivePage(2)}>
                        <div className="num">2</div>
                        <div className="onboarding__tooltip">CCTV 조회 사용 가이드</div>
                    </li>
                    <li className={`pagination__item ${activePage===3 ? 'active' : ''}`} onClick={()=>setActivePage(3)}>
                        <div className="num">3</div>
                        <div className="onboarding__tooltip">이벤트 사용 가이드</div>
                    </li>
                    <li className={`pagination__item ${activePage===4 ? 'active' : ''}`}onClick={()=>setActivePage(4)}>
                        <div className="num">4</div>
                        <div className="onboarding__tooltip">순찰 사용 가이드</div>
                    </li>
                </ul>
                <button type="button" className="btn-onboarding-close" onClick={handleCls}>닫기</button>
            </div>
        </section>
    );
};

export default BoardMain