/**
 * @module SalesOrderMaintain
 */
import { FC, useCallback, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { useAppSelector } from '../../../../store/hooks';
import { MaintainContextProvider } from '../../components/maintain/contexts/maintain.context';
import MaintainHeader from '../../components/maintain/maintain-header';
import { useEntityDeleteModal } from '../../components/table/hooks/useEntityDeleteModal';
import { useRedirectModal } from '../operations/hooks/useRedirectModal';
import { SalesOrder } from '../settings/redux/salesOrders/interfaces';
import { salesOrderThunks } from '../settings/redux/salesOrders/thunks';
import { UseSalesOrderForm } from './hooks/useSalesOrderForm';
import SalesOrderForm from './salesOrder-form';
export interface SalesOrderMaintainProps {
  copy?: boolean;
}

/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The {@link useSalesOrderForm} hook is used to create a form and connect it with {@link MaintainContext}.
 * The page defines a {@link useEntityDeleteModal | delete modal} and a {@link useRedirectModal | redirect modal}.
 * Redux slice, modals and form are passed to {@link MaintainContextValue} and are to context children inside {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader} and {@link SalesOrderForm} component all wrapped inside a {@link MaintainContext.MaintainContextProvider }
 */
const SalesOrderMaintain: FC<SalesOrderMaintainProps> = ({ copy }: SalesOrderMaintainProps) => {
  const sliceState = useAppSelector((state) => state.salesOrders);
  const { loading } = sliceState;
  const form = UseSalesOrderForm({ state: sliceState, copy });
  const getName = useCallback((entity: SalesOrder): string => String(entity.orderNumber), []);
  const { deleteThunk } = salesOrderThunks;
  const {
    formState: { isDirty },
  } = form;
  const ns = 'salesOrder';

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
      crudThunk: salesOrderThunks,
      state: sliceState,
      onDelete,
      openRedirectModal,
    }),
    [copy, onDelete, openRedirectModal, sliceState],
  );

  return (
    <FormProvider {...form}>
      <MaintainContextProvider value={contextValue}>
        <div className='maintain' data-testid='maintain'>
          <MaintainHeader />
          {!loading && <SalesOrderForm />}
        </div>
        {deleteModal}
        {redirectModal}
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default SalesOrderMaintain;
