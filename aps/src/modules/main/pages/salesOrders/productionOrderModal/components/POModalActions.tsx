/**
 * @module POModalActions
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductionOrderFormData } from '../../../settings/redux/productionOrders/interfaces';
import { ProductionOrderModalForm } from '../../../settings/redux/productionOrders/productionOrdersModal/interfaces';

export type POModalActionsProps = {
  productionOrderInitial: ProductionOrderFormData;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
};
/**
 *
 * @param productionOrderInitial Initial production order values returned by {@link usePOModalInitialValues} hook.
 * @returns Production order create button and lot standard quantity values with logic for their calculation
 */
const POModalActions: FC<POModalActionsProps> = ({ productionOrderInitial, translate }) => {
  const form = useFormContext<ProductionOrderModalForm>();
  const { watch, setValue } = form;
  const { numberOfProductionOrders, lotStandardQuantity, routingId, productionOrderTypeId } =
    watch();

  const POGenerator = useCallback((): void => {
    const newPOsTest = Array(Number(numberOfProductionOrders) || 0).fill(productionOrderInitial);
    setValue('productionOrders', newPOsTest);
  }, [numberOfProductionOrders, productionOrderInitial, setValue]);

  debugger;
  const canCreatePOs =
    !numberOfProductionOrders ||
    !routingId ||
    !productionOrderTypeId ||
    numberOfProductionOrders > 99;

  return (
    <div className='actions'>
      {
        <p>
          {lotStandardQuantity && translate('lot_size')} {lotStandardQuantity}
        </p>
      }
      <CustomButton
        customClass='action-button'
        color='blue'
        type='button'
        onClick={POGenerator}
        isDisabled={canCreatePOs}
      >
        <div className='button-children'>
          <span>{translate('create_button')}</span>
        </div>
      </CustomButton>
    </div>
  );
};

export default POModalActions;
