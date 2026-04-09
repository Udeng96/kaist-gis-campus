import LastSearch from "./body/lastSearch.tsx";
import LastResult from "./body/result/lastResult.tsx";
import LastResultLi from "./body/result/lastResultLi.tsx";

const LastBody = () => {

    return(
        <div className="modal__body">
            <LastSearch/>
            <LastResult/>
            <LastResultLi/>
        </div>
    )

}

export default LastBody