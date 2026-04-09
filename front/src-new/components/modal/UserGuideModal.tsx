import { useState } from 'react';
import { createPortal } from 'react-dom';
import ONBOARD_ONE from '../../assets/image/img/img_onboarding-01_1920x1080.png';
import ONBOARD_TWO from '../../assets/image/img/img_onboarding-02_1920x1080.png';
import ONBOARD_THREE from '../../assets/image/img/img_onboarding-03_1920x1080.png';
import ONBOARD_FOUR from '../../assets/image/img/img_onboarding-04_1920x1080.png';

const PAGES = [
    { img: ONBOARD_ONE, alt: '건물 조회 사용 가이드 이미지', label: '건물 조회 사용 가이드' },
    { img: ONBOARD_TWO, alt: 'CCTV 조회 사용 가이드 이미지', label: 'CCTV 조회 사용 가이드' },
    { img: ONBOARD_THREE, alt: '이벤트 사용 가이드 이미지', label: '이벤트 사용 가이드' },
    { img: ONBOARD_FOUR, alt: '순찰 사용 가이드 이미지', label: '순찰 사용 가이드' },
];

interface Props {
    onClose: () => void;
}

const UserGuideModal = ({ onClose }: Props) => {
    const [activePage, setActivePage] = useState(1);

    const handleClose = () => {
        setActivePage(1);
        onClose();
    };

    return createPortal(
        <section className="onboarding active">
            <ul className="onboarding__list">
                {PAGES.map((page, i) => (
                    <li key={i} className={`onboarding__item ${activePage === i + 1 ? 'active' : ''}`}>
                        <img src={page.img} alt={page.alt} />
                    </li>
                ))}
            </ul>

            <div className="pagination">
                <ul>
                    {PAGES.map((page, i) => (
                        <li key={i}
                            className={`pagination__item ${activePage === i + 1 ? 'active' : ''}`}
                            onClick={() => setActivePage(i + 1)}>
                            <div className="num">{i + 1}</div>
                            <div className="onboarding__tooltip">{page.label}</div>
                        </li>
                    ))}
                </ul>
                <button type="button" className="btn-onboarding-close" onClick={handleClose}>닫기</button>
            </div>
        </section>,
        document.body
    );
};

export default UserGuideModal;
