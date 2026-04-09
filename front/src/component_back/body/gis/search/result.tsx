import {type Dispatch, type SetStateAction} from "react";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {LEFT_MENU_CAMPUS} from "../../../../data_back/const/common.ts";

const Result = (props: {
    results: { name: string, type: string, cd: string, xcrdnt: string, ycrdnt: string }[],
    keyword: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {

    const {activeFac, setActiveFac, setActiveCenter} = useGisStore(useShallow((state) => ({
        activeFac: state.activeFac,
        setActiveFac: state.actions.setActiveFac,
        setActiveCenter: state.actions.setActiveCenter,
    })))

    const {
        activeTab,
    } = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
    })))

    const handleActiveBtn = (result: { name: string, type: string, cd: string, xcrdnt: string, ycrdnt: string }) => {

        if (activeFac === null || (activeFac && activeFac.cd !== result.cd)) {
            setActiveFac(result);
        } else {
            setActiveFac(null);
        }

        if (activeTab.cd !== LEFT_MENU_CAMPUS.cd) {
            // setActiveTab(LEFT_MENU_CAMPUS);
        }
        setActiveCenter([Number(result.ycrdnt), Number(result.xcrdnt)])
    }

    const highlight = (text: string, keyword: string): string[] => {
        if (!keyword) return [text];

        const lowerText = text.toLowerCase();
        const lowerKey = keyword.toLowerCase();
        const result: string[] = [];

        let i = 0;
        while (i < text.length) {
            // 현재 부분이 keyword 와 정확히 일치하는 위치인지 확인
            if (lowerText.startsWith(lowerKey, i)) {
                const prev = text[i - 1];
                const next = text[i + keyword.length];


                const isPrevOk = !prev || !/[0-9A-Za-z가-힣]/.test(prev);
                const isNextOk = !next || !/[0-9A-Za-z가-힣]/.test(next);

                // 앞/뒤 경계가 완전히 떨어진 경우에만 하이라이트
                if (isPrevOk && isNextOk) {
                    i += keyword.length;
                    result.push(text.substring(0, i))
                    result.push(text.substring(i, i + keyword.length));
                    result.push(text.substring(i + keyword.length, text.length))
                    continue;
                } else {
                    result.push(text.substring(0, i))
                    result.push(text.substring(i, i + keyword.length));
                    result.push(text.substring(i + keyword.length, text.length))
                }
            }
            i++;
        }

        if (result.length === 0) {
            result.push(text);
        }
        return result;
    };

    return (
        <>
            {
                <div className="result">
                    <div className="result__head">총<span>{props.results.length}</span>건</div>
                    <div className="result__body">
                        <ul className="result__list">
                            {
                                props.results.length > 0 &&
                                props.results.map((result) => (
                                    <li className={`result__item result__item--${result.type} ${activeFac && activeFac.cd === result.cd ? 'active' : ''}`}
                                        onClick={() => handleActiveBtn(result)}>
                                        {
                                            result.type === 'building' &&
                                            <p>
                                                <strong>
                                                    {
                                                        highlight(result.cd, props.keyword).length > 0 &&
                                                        highlight(result.cd, props.keyword).map((item) => {
                                                            if (item === props.keyword) {
                                                                return <span>{item}</span>
                                                            } else {
                                                                return item;
                                                            }
                                                        })
                                                    }
                                                </strong>
                                                {' '}
                                                {
                                                    highlight(result.name, props.keyword).length > 0 &&
                                                    highlight(result.name, props.keyword).map((item) => {
                                                        if (item === props.keyword) {
                                                            return <span>{item}</span>
                                                        } else {
                                                            return item;
                                                        }
                                                    })
                                                }
                                            </p>

                                        }
                                        {
                                            result.type === 'cctv' &&
                                            <p> {
                                                highlight(result.name, props.keyword).length > 0 &&
                                                highlight(result.name, props.keyword).map((item) => {
                                                    if (item === props.keyword) {
                                                        return <span>{item}</span>
                                                    } else {
                                                        return item;
                                                    }
                                                })
                                            }</p>
                                        }
                                    </li>
                                ))
                            }
                            {
                                props.results.length === 0 &&
                                <div className=" no-data" style={{display: "none"}}>
                                    <p className="message"><span>‘{props.keyword}’</span>에 대한 <br/>검색 결과가 없습니다.<br/>검색
                                        조건 변경 후 다시 시도해 주세요.</p>
                                </div>
                            }
                        </ul>
                    </div>

                    {/* 검색결과 없음 */}
                    <div className="result__footer">
                        <button type="button" onClick={() => props.setIsOpen(false)}>접기</button>
                    </div>
                </div>
            }
        </>
    )

}

export default Result