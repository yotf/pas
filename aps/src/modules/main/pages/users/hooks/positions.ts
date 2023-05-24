/**
 * @module usePositions
 */

import { DefaultOptionType } from 'antd/lib/select';
import { getAllPositions } from '../../settings/redux/positions/thunks';
import { useOptions } from './options';
import { SettingsPageItem } from '@/modules/main/pages/settings/consts/interfaces';

export type UsePositionsReturnType = {
  positions: SettingsPageItem[];
  options: DefaultOptionType[];
};
/**
 *
 * @returns Positions for {@link UserModal} dropdown
 */
export const usePositions = (): UsePositionsReturnType => {
  const { entities: positions, options } = useOptions({
    selector: (state) => state.positions.data,
    thunk: getAllPositions,
  });
  return { positions, options };
};
/**
 *
 * @returns Positions for {@link UserModal} dropdown with status active
 */
export const useUserPositions = (
  selectedPositionId: number | undefined,
): UsePositionsReturnType => {
  const { entities: positions, options } = useOptions({
    selector: (state) =>
      state.positions.data.filter((x) => x.isActive || Number(x.id) === selectedPositionId),
    thunk: getAllPositions,
  });
  return { positions, options };
};
