import {create} from "zustand/react";

interface Commontype {

    activeAlarm : boolean,
    activeLeftMenu : string,

    actions: {
        setActiveAlarm : (activeAlarm :boolean) => void,
        setActiveLeftMenu : (activeLeftMenu :string) => void,
    }
}

export const useCommonClientStore = create<Commontype>((set) => ({
        activeLeftMenu : 'CAMPUS',
        activeAlarm : true,
        actions: {
            setActiveAlarm : (activeAlarm :boolean) => set({activeAlarm : activeAlarm}),
            setActiveLeftMenu : (activeLeftMenu: string) => set({activeLeftMenu: activeLeftMenu}),
        }
    }
))