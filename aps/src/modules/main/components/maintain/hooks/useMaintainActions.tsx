/**
 * @module useMaintainActions
 */

import { useCallback, useContext, useMemo } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../../store/hooks';
import { COPY_PAGE } from '../../../consts/pageRouter';
import { IdentifiableEntity } from '../../../pages/settings/redux/thunks';
import { MaintainContext } from '../contexts/maintain.context';

export type UseMaintainActionsReturnType = {
  onSubmit: () => void;
  onCopyClick?: () => void;
  onDeleteClick: () => void;
  onBackClick: () => void;
};
/**
 * Uses {@link MaintainContext | Maintain Context} and RHF useFormContext data to determine with which entity are the returned actions performed.
 * @param copy Determines if the page rendered is a Copy page or not
 * @returns OnSubmit, onCopyClick, onDeleteClick and onBackClick functions used on maintain pages
 */
export const useMaintainActions = (copy = true): UseMaintainActionsReturnType => {
  const {
    state,
    crudThunk: { upsertThunk },
    onDelete,
    openRedirectModal,
  } = useContext(MaintainContext);
  const { entity } = state;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleSubmit } = useFormContext();

  const onBackClick = useCallback(
    (): void => openRedirectModal!(() => navigate('..')),
    [navigate, openRedirectModal],
  );

  const onSubmit = useMemo(
    () =>
      handleSubmit((data: FieldValues): void => {
        //debugger;
        dispatch(upsertThunk(data as IdentifiableEntity));
      }),

    [dispatch, handleSubmit, upsertThunk],
  );
  const onCopyClick = useMemo(
    () =>
      copy
        ? (): void =>
            openRedirectModal!(
              () =>
                navigate('../' + COPY_PAGE.replace(':id', entity.id), {
                  replace: false,
                  state: entity,
                }),
              true,
            )
        : undefined,
    [copy, entity, navigate, openRedirectModal],
  );

  const onDeleteClick = useCallback((): void => onDelete!(entity), [entity, onDelete]);
  return { onSubmit, onCopyClick, onDeleteClick, onBackClick };
};

export default useMaintainActions;
