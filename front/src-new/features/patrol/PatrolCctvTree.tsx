import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'font-awesome/css/font-awesome.min.css';
import { useFacStore } from '@store/facStore';
import { usePatrolStore } from '@store/patrolStore';
import type { CctvType } from '@api/types/fac';

type TreeNode = {
    value: string;
    label: string;
    children?: TreeNode[];
};

type Props = {
    activeArea: string;
};

const PatrolCctvTree = ({ activeArea }: Props) => {
    const cctvResponse = useFacStore((s) => s.cctvs);
    const buildingResponse = useFacStore((s) => s.buildings);
    const cctvItems = cctvResponse?.cctvItems ?? [];
    const buildingItems = buildingResponse?.buildingItems ?? [];

    const editCctvs = usePatrolStore((s) => s.editCctvs);
    const addEditCctv = usePatrolStore((s) => s.actions.addEditCctv);
    const removeEditCctv = usePatrolStore((s) => s.actions.removeEditCctv);

    const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);

    // 트리 노드 생성: 건물별 그룹
    useEffect(() => {
        const filteredBuildings = buildingItems.filter(
            (b) => b.area === activeArea
        );

        const nodes: TreeNode[] = filteredBuildings.map((building, idx) => {
            const code = building.facInfo.facId;
            const buildingCctvs = cctvItems.filter(
                (c) => c.building?.split('/').includes(code)
            );

            return {
                value: `building_${idx}`,
                label: `${code} (${buildingCctvs.length})`,
                children: buildingCctvs.map((c) => ({
                    value: `${code}_${c.facInfo.facId}`,
                    label: c.facInfo.facName,
                })),
            };
        });

        setTreeNodes(nodes);
    }, [cctvItems, buildingItems, activeArea]);

    // 선택된 CCTV → checked 동기화
    useEffect(() => {
        const checkedValues = editCctvs
            .filter((c) => (c.cctvInfo.building ?? '').startsWith(activeArea))
            .map((c) => `${c.cctvInfo.building}_${c.cctvInfo.facInfo.facId}`);
        setChecked(checkedValues);
    }, [editCctvs, activeArea]);

    const handleCheck = (checkedList: string[]) => {
        // 현재 area의 기존 선택을 모두 제거
        const otherAreaCctvs = editCctvs.filter(
            (c) => !(c.cctvInfo.building ?? '').startsWith(activeArea)
        );

        // 체크된 것들을 추가
        const newCctvs = checkedList
            .filter((v) => v.includes('_CCTV')) // 건물 노드 제외
            .map((checkItem) => {
                const [buildingCode, ...rest] = checkItem.split('_');
                const streamId = rest.join('_');
                const cctv = cctvItems.find((c) => c.facInfo.facId === streamId);
                if (!cctv) return null;
                return {
                    order: 0,
                    cctvInfo: { ...cctv, building: buildingCode },
                };
            })
            .filter(Boolean) as { order: number; cctvInfo: CctvType }[];

        // 전체 리스트 재구성
        const allCctvs = [...otherAreaCctvs, ...newCctvs].map((c, i) => ({
            ...c,
            order: i,
        }));

        // store 갱신: 전체 교체
        // removeEditCctv로 하나씩 제거 후 addEditCctv로 추가하는 대신
        // patrolStore에 setEditCctvs가 필요합니다
        // 일단 우회: 전체 clear 후 add
        const store = usePatrolStore.getState();
        // clear all
        for (let i = store.editCctvs.length - 1; i >= 0; i--) {
            store.actions.removeEditCctv(i);
        }
        // add all
        allCctvs.forEach((c) => store.actions.addEditCctv(c));
    };

    return (
        <CheckboxTree
            nodes={treeNodes}
            checked={checked}
            expanded={expanded}
            onCheck={handleCheck}
            onExpand={setExpanded}
        />
    );
};

export default PatrolCctvTree;
