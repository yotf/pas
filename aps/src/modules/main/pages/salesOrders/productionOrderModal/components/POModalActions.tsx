/**
 * @module POModalActions
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { FC, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductionOrderFormData } from '../../../settings/redux/productionOrders/interfaces';
import { ProductionOrderModalForm } from '../../../settings/redux/productionOrders/productionOrdersModal/interfaces';
import { useAppSelector } from '@/store/hooks';
import { SalesMaterialFormData } from '../../../settings/redux/salesOrders/interfaces';

export type POModalActionsProps = {
  productionOrderInitial: ProductionOrderFormData;
  selectedMaterialFull: any;
  selectedMaterial: SalesMaterialFormData | undefined;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
};
/**
 *
 * @param productionOrderInitial Initial production order values returned by {@link usePOModalInitialValues} hook.
 * @returns Production order create button and lot standard quantity values with logic for their calculation
 */
const POModalActions: FC<POModalActionsProps> = ({
  productionOrderInitial,
  translate,
  selectedMaterialFull,
  selectedMaterial,
}) => {
  const form = useFormContext<ProductionOrderModalForm>();
  const { watch, setValue } = form;
  const { numberOfProductionOrders, lotStandardQuantity, routingId, productionOrderTypeId } =
    watch();

  const { data: routings } = useAppSelector((state) => state.routings);

  const selectedRouting = useMemo(
    () => routings.find((routing) => routing.id === routingId),
    [routings, routingId],
  );

  const POGenerator = useCallback((): void => {
    const newPOsTest = Array(Number(numberOfProductionOrders) || 0).fill(productionOrderInitial);

    let productionOrderQuantities: number[] = [];
    const lotSize = selectedRouting?.lotStandardQuantity;
    let q1 = selectedMaterial?.quantity1;
    while (lotSize && q1 && q1 > 0) {
      const quantityInCurrentOrder = Math.min(q1, lotSize);
      q1 -= quantityInCurrentOrder;
      productionOrderQuantities.push(quantityInCurrentOrder);
    }

    productionOrderQuantities =
      numberOfProductionOrders && productionOrderQuantities.length < numberOfProductionOrders
        ? productionOrderQuantities.concat(
            Array(numberOfProductionOrders - productionOrderQuantities.length).fill(0),
          )
        : productionOrderQuantities;

    const withq1 = newPOsTest.map((po, i) => {
      const updatedPO = { ...po };
      updatedPO.quantity1 = productionOrderQuantities[i];
      updatedPO.quantity2 = po.quantity1 * (selectedMaterialFull?.factorAreaToPc || 1); //TODO
      updatedPO.quantity3 = po.quantity1 * (selectedMaterialFull?.factorAreaToKG || 1); //TODO
      return updatedPO;
    });

    setValue('productionOrders', withq1);

    // quantity1: selectedMaterial?.quantity1
    //       ? Number((selectedMaterial?.quantity1 / (numberOfProductionOrders || 1)).toFixed(2))
    //       : 0, //
    //     quantity2: selectedMaterial?.quantity1
    //       ? selectedMaterial?.quantity1 / (selectedMaterialFull?.factorAreaToPc || 1)
    //       : 0,
    //     quantity3: selectedMaterial?.quantity1
    //       ? selectedMaterial?.quantity1 / (selectedMaterialFull?.factorAreaToKG || 1)
    //       : 0,
  }, [numberOfProductionOrders, productionOrderInitial, setValue]);

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
