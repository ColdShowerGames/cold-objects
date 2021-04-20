import { useSetRecoilState } from "recoil";
import { IPoolkitData, IPoolUnit, PoolUnitPreview } from "../poolAtoms";

/**
 * Allows spawning and initialization of a pool.
 */
export const usePoolControl = <T extends IPoolUnit>(poolData: IPoolkitData<T>) => {
    const setIds = useSetRecoilState(poolData.ids);
    const setAvailableUnit = useSetRecoilState(poolData.setAvailableId);

    const spawnUnit = (createSpawn: () => PoolUnitPreview) => {
        const spawnedUnit = {
            ...(createSpawn()),
            POOL_ID: 0,
            IS_POOL_SPAWNED: true,
        } as T;
        setAvailableUnit(spawnedUnit);
    };

    const initPool = () => {
        setIds(new Array(poolData.poolSize).fill(null)
            .map((_, index) => index));
    };

    return {
        spawnUnit,
        initPool,
    };
};

