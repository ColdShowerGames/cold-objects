import { useRecoilValue } from "recoil";
import { IPoolkitData, IPoolUnit } from "../poolAtoms";

/**
 * Get the values of all the ids from a pool
 * @param poolData
 */
export const usePoolIds = <T extends IPoolUnit>(poolData: IPoolkitData<T>) => {
    return useRecoilValue(poolData.ids);
};