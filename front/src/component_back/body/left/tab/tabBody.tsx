import CampusMenu from "./menu/campus/campusMenu.tsx";
import Event from "./menu/event/event.tsx";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {LEFT_MENU_CAMPUS, LEFT_MENU_EVENT, LEFT_MENU_FAVORITE} from "../../../../data_back/const/common.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchEvents} from "../../../../data_back/api/left/leftApi.ts";
import {useEffect} from "react";
import {useShallow} from "zustand/react/shallow";
import FavoriteMenu from "./menu/favorite/favoriteMenu.tsx";

const TabBody = () => {

    const {
        activeTab,
        eventParam,
        setActiveEvent,
        setEventList,
        setActiveEventCctvs,
        setEventSearchParam
    } = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        eventParam: state.eventSearchParam,
        setActiveEvent: state.actions.setActiveEvent,
        setEventList: state.actions.setEventList,
        setActiveEventCctvs: state.actions.setActiveEventCctvs,
        setEventSearchParam: state.actions.setEventSearchParam
    })));

    const {data: eventRes} = useQuery({
            queryKey: ['mainEvents', eventParam],
            queryFn: () => fetchEvents({
                eventArea: eventParam ? eventParam.eventArea : '',
                eventType: eventParam ? eventParam.eventType : ''
            }),
            enabled: eventParam !== null,
        },
    )

    useEffect(() => {
        function runAtNextMidnight(callback: () => void) {
            const now = new Date();
            const next = new Date();
            next.setHours(24, 0, 0, 0);
            const msUntilMidnight = next.getTime() - now.getTime();

            setTimeout(() => {
                callback();
                setInterval(callback, 24 * 60 * 60 * 1000);
            }, msUntilMidnight);
        }

        runAtNextMidnight(() => {
            console.log("자정 → eventParam 자동 변경");
            setEventSearchParam({eventArea: 'WHOLE', eventType: 'whole'});
        });

    }, []);

    useEffect(() => {
        if (eventRes) {
            if (eventRes.data) {
                setEventList(eventRes.data);
                setActiveEvent(null);
                setActiveEventCctvs([]);
                setEventSearchParam(null);
            }
        }
    }, [eventRes]);
    return (
        <div className="content__body">
            <ul>
                {
                    activeTab.cd === LEFT_MENU_CAMPUS.cd && <CampusMenu/>
                }
                {
                    activeTab.cd === LEFT_MENU_EVENT.cd && <Event/>
                }
                {
                    activeTab.cd === LEFT_MENU_FAVORITE.cd && <FavoriteMenu/>
                }
            </ul>
        </div>

    )
}

export default TabBody