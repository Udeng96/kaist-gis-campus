import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PatrolCctvType } from '@api/types/patrol';

const CCTV_TYPE_MAP: Record<string, { class: string; label: string }> = {
    IN: { class: 'in', label: '내부' },
    OUT: { class: 'out', label: '외부' },
    FLAME: { class: 'flame', label: '불꽃' },
};

type Props = {
    cctv: PatrolCctvType;
    idx: number;
    onRemove: () => void;
};

const PatrolCctvItem = ({ cctv, idx, onRemove }: Props) => {
    const building = cctv.cctvInfo?.building ?? '';
    const area = building ? building.substring(0, 1) + '구역' : '';
    const typeInfo = CCTV_TYPE_MAP[cctv.cctvInfo?.type ?? ''] ?? CCTV_TYPE_MAP.IN;
    const sortId = `${building}_${cctv.cctvInfo?.facInfo?.facId}`;

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sortId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={{ ...style, marginBottom: 4 }}>
            <div className={`patrol__item__box patrol__item__box--${typeInfo.class}`} style={{ position: 'relative' }}>
                <i>{idx + 1}</i>
                <div className="frame" {...attributes} {...listeners}>
                    <p>{area}</p>
                    <p>{building}</p>
                    <p>{typeInfo.label}</p>
                    <p>{cctv.cctvInfo?.facInfo?.facName ?? ''}</p>
                </div>
                <button
                    type="button"
                    className="btn-close btn-close-02"
                    onClick={onRemove}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                />
            </div>
        </li>
    );
};

export default PatrolCctvItem;
