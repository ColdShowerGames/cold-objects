import { useEffect } from "react";
import { IPoolkitData, IPoolUnit } from "../poolAtoms";
import { usePoolUnitValue } from "./usePoolUnit";

export const usePoolOnDespawn = <T extends IPoolUnit>(poolData: IPoolkitData<T>,
    id: number,
    handler: () => any) => {
    const unitData = usePoolUnitValue(poolData, id);

    useEffect(() => {
        if (!unitData.IS_POOL_SPAWNED) {
            return handler();
        }
    }, [unitData.IS_POOL_SPAWNED]);
};