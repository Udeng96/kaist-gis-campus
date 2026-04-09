import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useEffect} from "react";

const Toast = () => {

    const {activeToast, setActiveToast} = useMainStore(useShallow((state) => ({
        activeToast: state.activeToast,
        setActiveToast: state.actions.setActiveToast
    })))

    useEffect(() => {
        if (activeToast.cd !== 'NONE') {
            const timer = setTimeout(() => {
                setActiveToast({cd: 'NONE', msg: ''})
            }, 3000);

            return () => {
                clearTimeout(timer);
            }
        }
    }, [activeToast]);

    return (
        <>
            {
                <div id={`toast-${activeToast.cd}`}
                     className={`toast toast--${activeToast.cd} ${activeToast.cd === 'NONE' ? 'hidden' : ''} `}>
                    <i className="toast__icon"></i>
                    <p className="toast__message">{activeToast.msg}</p>
                    <button type="button" className="btn-close 2toast-close"
                            onClick={() => setActiveToast({cd: 'NONE', msg: ''})}></button>
                </div>
            }

        </>
    )
}

export default Toast