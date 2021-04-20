import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { IPoolkitData, IPoolUnit } from "../poolAtoms";

/**
 * Use state of a pool unit
 */
export const usePoolUnitState = <T extends IPoolUnit>(poolData: IPoolkitData<T>,
    id: number) => {
    return useRecoilState(poolData.family(id));
};

/**
 * Use only the state value of a pool unit
 */
export const usePoolUnitValue = <T extends IPoolUnit>(poolData: IPoolkitData<T>,
    id: number) => {
    return useRecoilValue(poolData.family(id));
};

/**
 * Use only the setter of a state of a pool unit
 */
export const useSetPoolUnitState = <T extends IPoolUnit>(poolData: IPoolkitData<T>,
    id: number) => {
    return useSetRecoilState(poolData.family(id));
};

/**
 * Despawn the pool unit that has the given id.
 */
export const usePoolUnitDespawn = <T extends IPoolUnit>(poolData: IPoolkitData<T>,
    id: number): (delay?: number) => (number | null) => {
    const setPoolUnit = useSetPoolUnitState(poolData, id);

    return (delay?: number): number | null => {
        const setDespawned = () => setPoolUnit(prev => ({
            ...prev,
            IS_POOL_SPAWNED: false,
        }));

        if (delay) {
            return setTimeout(setDespawned, delay);
        } else {
            setDespawned();
            return null;
        }
    };
};

/**
 * Get the array of all current spawned pool units.
 */
export const usePoolSpawnedUnits = <T extends IPoolUnit>(poolData: IPoolkitData<T>) => {
    return useRecoilValue(poolData.getAllSpawnedUnits);
};

