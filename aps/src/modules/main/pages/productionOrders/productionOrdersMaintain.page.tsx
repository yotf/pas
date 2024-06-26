/**
 * @module ProductionOrderMaintain
 */

import { useAppSelector } from '@/store/hooks';
import { FC, useCallback, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { MaintainContextProvider } from '../../components/maintain/contexts/maintain.context';
import MaintainHeader from '../../components/maintain/maintain-header';
import { useEntityDeleteModal } from '../../components/table/hooks/useEntityDeleteModal';
import { useRedirectModal } from '../operations/hooks/useRedirectModal';
import { ProductionOrder } from '../settings/redux/productionOrders/interfaces';
import { productionOrderThunks } from '../settings/redux/productionOrders/thunks';
import { useProductionOrderForm } from './hooks/useProductionOrdersForm';
import ProductionOrderForm from './productionOrdersForm';
export interface ProductionOrderMaintainType {
  copy?: boolean;
}

/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The {@link useProductionOrderForm} hook is used to create a form and connect it with {@link MaintainContext}.
 * The page defines a {@link useEntityDeleteModal | delete modal} and a {@link useRedirectModal | redirect modal}.
 * Redux slice, modals and form are passed to {@link MaintainContextValue} and are available to context children {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader} and {@link ProductionOrderForm} component all wrapped inside a {@link MaintainContext.MaintainContextProvider }
 */

const ProductionOrderMaintain: FC<ProductionOrderMaintainType> = ({
  copy,
}: ProductionOrderMaintainType) => {
  const sliceState = useAppSelector((state) => state.productionOrders);
  const { loading } = sliceState;
  const form = useProductionOrderForm({ state: sliceState, copy });
  const getName = useCallback(
    (entity: ProductionOrder): string => String(entity.productionOrder_Id ?? ''),
    [],
  );
  const { deleteThunk } = productionOrderThunks;
  const {
    formState: { isDirty },
  } = form;
  const ns = 'productionOrder';
  const [discardOperations, setDiscardOperations] = useState<boolean>(false);

  const { onDelete, modal: deleteModal } = useEntityDeleteModal({
    ns,
    deleteThunk,
    state: sliceState,
    getName,
  });
  const { redirectModal, openRedirectModal } = useRedirectModal({
    isDirty,
  });

  const updateDiscardOperations = (newValue: boolean) => {
    setDiscardOperations(newValue);
  };

  const contextValue = useMemo(
    () => ({
      ns,
      copying: !!copy,
      crudThunk: productionOrderThunks,
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
          {!loading && (
            <ProductionOrderForm
              discardOperations={discardOperations}
              updateDiscardOperations={updateDiscardOperations}
              copy={copy}
            />
          )}
        </div>
        {deleteModal}
        {redirectModal}
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default ProductionOrderMaintain;
