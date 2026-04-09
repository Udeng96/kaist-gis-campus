import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { WeatherType } from '@api/types/common';
import LOGO from '@assets/image/lgo/lgo_kaist_200x36.svg';
import UserGuideModal from '../components/modal/UserGuideModal';

const Header = () => {
    const [date, setDate] = useState(moment().format('YYYY년 MM월 DD일 HH:mm'));
    const [showGuide, setShowGuide] = useState(false);

    const { data: weather } = useQuery({
        queryKey: ['weather'],
        queryFn: () => getHttp<WeatherType>(BASE_URL + END_POINT.COMMON.WEATHER, {}),
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        const timer = setInterval(() => setDate(moment().format('YYYY년 MM월 DD일 HH:mm')), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <header id="header" className="header">
                <div className="header__logo">
                    <img src={LOGO} alt="카이스트 로고 이미지" />
                </div>
                <div className="frame">
                    <div className="date"><p>{date}</p></div>
                    <div className="weather">
                        <div className={`weather__icon ${weather?.skyIcon ?? 'sun'}`} />
                        <p className="weather__text">{weather?.skyNm ?? '맑음'}</p>
                        <p className="temp__value">{weather?.temp ?? '0'}<span>℃</span></p>
                    </div>
                    <div className="dust">
                        <div className={`dust__view dust__view--${weather?.dustIcon ?? 'normal'}`}>
                            <p>미세먼지</p>
                        </div>
                        <div className={`dust__view dust__view--${weather?.ultraDustIcon ?? 'normal'}`}>
                            <p>초미세먼지</p>
                        </div>
                    </div>
                </div>
                <div className="marquee">
                    <p>{weather?.report ?? '특보 없음'}</p>
                </div>
                <button type="button" className="btn-onboarding" onClick={() => setShowGuide(true)}>사용가이드</button>
            </header>
            {showGuide && <UserGuideModal onClose={() => setShowGuide(false)} />}
        </>
    );
};

export default Header;
