import {
    atom,
    atomFamily,
    RecoilState,
    RecoilValueReadOnly,
    selector,
} from "recoil";

/**
 * Holds information about the pool spawned state.
 * Your pooled units must extend this interface for pool management to work.
 */
export interface IPoolUnit {
    IS_POOL_SPAWNED: boolean;
    POOL_ID: number;
}

export type PoolUnitPreview = Omit<IPoolUnit, "POOL_ID" | "IS_POOL_SPAWNED">;

export interface IPoolkitData<T extends IPoolUnit> {
    ids: RecoilState<number[]>;
    family: (param: number) => RecoilState<T>;
    setAvailableId: RecoilState<T>;
    poolSize: number;
    getAllSpawnedUnits: RecoilValueReadOnly<T[]>
}

/**
 * Create a poolkit object
 * @param uniquePoolName A unique value for the pool name.
 * No other pool can have the same name.
 * @param poolSize The number of items for this pool to have. This is the
 * maximum number of units that can be spawned at the same time.
 * @param defaultUnitValue The default value of a spawn if you spawn a unit
 * without a value.
 */
export const createPoolkit = <T extends IPoolUnit>(
    uniquePoolName: string,
    poolSize: number,
    defaultUnitValue: () => PoolUnitPreview): IPoolkitData<T> => {

    const ids = atom<number[]>({
        key: `POOL_${uniquePoolName}_ids`,
        default: [],
    });

    const defaultValue = {
        ...(defaultUnitValue()),
        POOL_ID: -1,
        IS_POOL_SPAWNED: false
    } as T;

    const family = atomFamily<T, number>({
        key: `POOL_${uniquePoolName}_family`,
        default: defaultValue,
    });

    const setAvailableId = selector<T>({
        key: `POOL_${uniquePoolName}_selectAvailable`,
        get: () => defaultValue,
        set: ({
            get,
            set,
        }, newValue) => {
            const dataIds = get(ids);
            const indexOfAvailable = dataIds.find(id => !get(family(id)).IS_POOL_SPAWNED);

            if (indexOfAvailable !== 0 && !indexOfAvailable) {
                const allUnitStates = dataIds.map(id => get(family(id)));
                throw new Error("Enemy pool size has been exceeded. Cannot get enemy to" +
                                " spawn. id index = " + JSON.stringify(allUnitStates));
            }
            (newValue as T).POOL_ID = indexOfAvailable;
            set(family(indexOfAvailable), newValue);
        },
    });

    const getAllSpawnedUnits = selector<T[]>({
        key: `POOL_${uniquePoolName}_selectAllSpawned`,
        get: ({ get }) => get(ids)
            .map(id => get(family(id)))
            .filter(u => u.IS_POOL_SPAWNED),
    });

    return {
        ids,
        family,
        setAvailableId,
        poolSize,
        getAllSpawnedUnits,
    };
};