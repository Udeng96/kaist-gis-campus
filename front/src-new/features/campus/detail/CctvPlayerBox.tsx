import type { CctvType } from '@api/types/fac';
import WebRTCPlayer from './WebRTCPlayer';

interface Props {
    num: number;
    cctv: CctvType;
}

const CctvPlayerBox = ({ num, cctv }: Props) => (
    <li className={`cctv__item cctv__item--${cctv.type.toLowerCase()}`}>
        <div className="cctv__head">
            <div className="num">{num}</div>
            <p>{cctv.facInfo.facName}</p>
        </div>
        <div className="cctv__body">
            <div className="cctv__in">
                <WebRTCPlayer cctvId={cctv.facInfo.facId} />
            </div>
            <button type="button" className="btn-expand" />
        </div>
    </li>
);

export default CctvPlayerBox;
