import { useState } from "react";
import TabHead from "./head/tabHead.tsx";
import TabBody from "./body/tabBody.tsx";

const LeftPanel = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <section className={`content content--left ${isOpen ? 'active' : ''}`}>
            <div className="dimmed"></div>
            <button
                type="button"
                className="btn-slide btn-slide--left"
                onClick={() => setIsOpen(!isOpen)}
            />
            <div className={`tab active`}>
                <TabHead />
                <TabBody />
            </div>
        </section>
    );
};

export default LeftPanel;
