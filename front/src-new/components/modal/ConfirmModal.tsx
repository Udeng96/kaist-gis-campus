interface Props {
    title: string;
    titleHighlight?: string;
    message: string;
    confirmLabel?: string;
    confirmType?: 'negative' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ title, titleHighlight, message, confirmLabel = '확인', confirmType = 'negative', onConfirm, onCancel }: Props) => {
    const renderTitle = () => {
        if (!titleHighlight || !title.includes(titleHighlight)) {
            return <span>{title}</span>;
        }
        const idx = title.indexOf(titleHighlight);
        const before = title.substring(0, idx);
        const after = title.substring(idx + titleHighlight.length);
        return (
            <>
                {before && <span>{before}</span>}
                <span style={{ color: confirmType === 'negative' ? 'var(--error)' : 'var(--primary)' }}>{titleHighlight}</span>
                {after && <span>{after}</span>}
            </>
        );
    };

    return (
        <div className="modal">
            <div className="dimmed" />
            <div className="modal__content confirm">
                <div className="modal__head">
                    <h2 className="modal__title">{renderTitle()}</h2>
                    <button className="btn-close modal-close" onClick={onCancel} />
                </div>
                <div className="modal__message">
                    {message}
                </div>
                <div className="modal__footer">
                    <button type="button" className="btn btn-normal modal-close" onClick={onCancel}>취소</button>
                    <button type="button" className={`btn btn-${confirmType} modal-close`} onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
