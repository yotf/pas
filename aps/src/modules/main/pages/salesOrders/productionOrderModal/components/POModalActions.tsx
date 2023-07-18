/**
 * @module POModalActions
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { FC, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductionOrderFormData } from '../../../settings/redux/productionOrders/interfaces';
import { ProductionOrderModalForm } from '../../../settings/redux/productionOrders/productionOrdersModal/interfaces';
import { useAppSelector } from '@/store/hooks';
import { number } from 'yup';
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
    debugger;
    const lotSize = selectedRouting?.lotStandardQuantity;
    const numberOfWholeLotSizes =
      selectedMaterial?.quantity1 && lotSize
        ? Math.floor(selectedMaterial?.quantity1 / lotSize)
        : 0;
    const numberOfRemains = numberOfProductionOrders
      ? numberOfProductionOrders - numberOfWholeLotSizes
      : 0;
    const equalRestSize =
      (selectedMaterial?.quantity1 && lotSize
        ? selectedMaterial?.quantity1 - numberOfWholeLotSizes * lotSize
        : 0) / numberOfRemains;

    const withq1 = newPOsTest.map((po, i) => {
      po.quantity1 = i < numberOfWholeLotSizes ? lotSize : equalRestSize;
      po.quantity2 = po.quantity1 ? po.quantity1 / (selectedMaterialFull?.factorAreaToPc || 1) : 0;
      po.quantity3 = po.quantity1 ? po.quantity1 / (selectedMaterialFull?.factorAreaToKG || 1) : 0;
      return po;
    });
    debugger;

    setValue('productionOrders', newPOsTest);

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
