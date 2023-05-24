/**
 * @module RoutingsMaintain
 */

import { FC, useCallback, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { useAppSelector } from '../../../../store/hooks';
import { MaintainContextProvider } from '../../components/maintain/contexts/maintain.context';
import MaintainHeader from '../../components/maintain/maintain-header';
import { useEntityDeleteModal } from '../../components/table/hooks/useEntityDeleteModal';
import { useRedirectModal } from '../operations/hooks/useRedirectModal';
import { Routing } from '../settings/redux/routings/interfaces';
import { routingThunks } from '../settings/redux/routings/thunks';
import { useRoutingForm } from './hooks/useRoutingForm';
import './maintainStyles.scss';
import RoutingsForm from './routings-form';

export interface RoutingMaintainProps {
  copy?: boolean;
}
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The {@link useRoutingForm} hook is used to create a form and connect it with {@link MaintainContext}.
 * The page defines a {@link useEntityDeleteModal | delete modal} and a {@link useRedirectModal | redirect modal}.
 * Redux slice, modals and form are passed to {@link MaintainContextValue} and are to context children inside {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader} and {@link RoutingsForm} component all wrapped inside a {@link MaintainContext.MaintainContextProvider }
 */
const RoutingsMaintain: FC<RoutingMaintainProps> = ({ copy }: RoutingMaintainProps) => {
  const sliceState = useAppSelector((state) => state.routings);
  const { loading } = sliceState;
  const form = useRoutingForm({ state: sliceState, copy });
  const getName = useCallback((entity: Routing): string => entity.name, []);
  const { deleteThunk } = routingThunks;
  const {
    formState: { isDirty },
  } = form;
  const ns = 'routings';

  const { onDelete, modal: deleteModal } = useEntityDeleteModal({
    ns,
    deleteThunk,
    state: sliceState,
    getName,
  });
  const { redirectModal, openRedirectModal } = useRedirectModal({
    isDirty,
  });

  const contextValue = useMemo(
    () => ({
      ns,
      copying: !!copy,
      crudThunk: routingThunks,
      state: sliceState,
      onDelete,
      openRedirectModal,
    }),
    [copy, onDelete, openRedirectModal, sliceState],
  );
  const isEdit = window.location.toString().includes('edit');
  return (
    <FormProvider {...form}>
      <MaintainContextProvider value={contextValue}>
        <div className={'maintain ' + (isEdit ? 'edit' : 'new')} data-testid='maintain'>
          <MaintainHeader />
          {!loading && <RoutingsForm />}
        </div>
        {deleteModal}
        {redirectModal}
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default RoutingsMaintain;
