/**
 * @module OperationsLayout
 */

import { MaintainContextProvider } from '@/modules/main/components/maintain/contexts/maintain.context';
import MaintainHeader from '@/modules/main/components/maintain/maintain-header';
import { useEntityDeleteModal } from '@/modules/main/components/table/hooks/useEntityDeleteModal';
import { useAppSelector } from '@/store/hooks';
import { FC, useCallback, useMemo } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Operation, OperationFormData } from '../../settings/redux/operations/interfaces';
import { operationThunks } from '../../settings/redux/operations/thunks';
import { useRedirectModal } from '../hooks/useRedirectModal';
import '../maintainStyles.scss';
import OperationsForm from './operations-form';

export type OperationsLayoutProps = {
  operationForEdit: OperationFormData | undefined;
  form: UseFormReturn<OperationFormData, any>;
  isLoaded: boolean;
  copying: boolean | undefined;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The page defines a {@link useEntityDeleteModal | delete modal} and a {@link useRedirectModal | redirect modal}.
 * Redux slice, modals and form are passed to {@link MaintainContextValue} and are available everywhere inside {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader} and {@link OperationsForm} component all wrapped inside a {@link MaintainContext.MaintainContextProvider }
 */
const OperationsLayout: FC<OperationsLayoutProps> = ({ form, isLoaded, copying }) => {
  const sliceState = useAppSelector((state) => state.operation);
  const ns = 'operations';
  const { deleteThunk } = operationThunks;
  const getName = useCallback((entity: Operation): string => entity.name, []);
  const {
    formState: { isDirty },
  } = form;
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
      copying: !!copying,
      crudThunk: operationThunks,
      state: sliceState,
      onDelete,
      openRedirectModal,
    }),
    [copying, onDelete, openRedirectModal, sliceState],
  );

  return (
    <FormProvider {...form}>
      <MaintainContextProvider value={contextValue}>
        <div className='operations-maintain' data-testid='operations-maintain'>
          <MaintainHeader />
          {isLoaded && <OperationsForm form={form} />}
          {deleteModal}
          {redirectModal}
        </div>
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default OperationsLayout;
