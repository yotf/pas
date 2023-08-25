/**
 * @module usePositions
 */

import { DefaultOptionType } from 'antd/lib/select';
import { getAllPositions } from '../../settings/redux/positions/thunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { rolesThunk } from '../../settings/redux/user/thunks';

export type UsePositionsReturnType = {
  positionOptions: DefaultOptionType[];
  roleOptions: DefaultOptionType[];
};
/**
 *
 * @returns Positions for {@link UserModal} dropdown
 */
// export const usePositions = (): UsePositionsReturnType => {
// const { entities: positions, options } = useOptions({
//   selector: (state) => state.positions.data,
//   thunk: getAllPositions,
// });
// return { positions, options };
// };
// /**
//  *
//  * @returns Positions for {@link UserModal} dropdown with status active
//  */
// export const useUserPositions = (
// selectedPositionId: number | undefined,
// ): UsePositionsReturnType => {
// const { entities: positions, options } = useOptions({
//   selector: (state) =>
//     state.positions.data.filter((x) => x.isActive || Number(x.id) === selectedPositionId),
//   thunk: getAllPositions,
// });
// return { positions, options };
// };

export const useUserOptions = (): UsePositionsReturnType => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllPositions());
    dispatch(rolesThunk());
  }, [dispatch]);

  const positions = useAppSelector((state) => state.positions.data);
  const positionOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(positions),
    [positions],
  );
  const roles = useAppSelector((state) => state.users.roles);

  const roleOptions = useMemo(
    () => roles.map((entity) => ({ label: entity.name, value: entity.id })) ?? [],
    [roles],
  );
  return { positionOptions, roleOptions };
};
