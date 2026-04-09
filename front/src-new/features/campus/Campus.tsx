import BuildingList from './building/BuildingList';
import CctvList from './cctv/CctvList';

const Campus = () => (
    <li className="tab__item tab__item--campus active">
        <BuildingList />
        <CctvList />
    </li>
);

export default Campus;
