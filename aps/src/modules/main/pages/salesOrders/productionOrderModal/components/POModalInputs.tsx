/**
 * @module POModalInputs
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { FC, useContext, useEffect } from 'react';
import { ProductionOrderModalForm } from '../../../settings/redux/productionOrders/productionOrdersModal/interfaces';
import { useProductionOrderModalOptions } from '../useProductionOrderModalOptions';

import { ProductionOrderFormData } from '../../../settings/redux/productionOrders/interfaces';
import { DefaultOptionType } from 'antd/es/select';
import ProductionOrderForm from '../../../productionOrders/productionOrdersForm';
import { useFormContext } from 'react-hook-form';

export type POModalInputsProps = {
  ns: string;
  productionOrderInitial: ProductionOrderFormData;
};
/**
 * @param ns Localization Namespace
 * @returns Production order modal inputs connected to the form defined in {@link useProductionOrderModal}
 */
const POModalInputs: FC<POModalInputsProps> = ({ ns, productionOrderInitial }) => {
  const { translate } = useTranslate({ ns: ns });
  const { orderTypeOptions, routingOptions } =
    useProductionOrderModalOptions(productionOrderInitial);

  const nameof = nameofFactory<ProductionOrderModalForm>();

  const form = useFormContext<ProductionOrderModalForm>();
  const { setValue } = form;
  useEffect(() => {
    setValue('routingId', productionOrderInitial.routingId);
  }, [setValue, productionOrderInitial.routingId, productionOrderInitial.materialId]);

  return (
    <div className='inputs'>
      <CustomInput
        type='number'
        label={translate('numberOfProductionOrders')}
        name={nameof('numberOfProductionOrders')}
        width='full-width'
        isRequired
      />
      <CustomInput
        type='select'
        label={translate('productionOrderTypeId')}
        name={nameof('productionOrderTypeId')}
        width='full-width'
        options={orderTypeOptions as DefaultOptionType[]}
        isRequired
      />
      <CustomInput
        type='select'
        label={translate('routingId')}
        name={nameof('routingId')}
        width='full-width'
        options={routingOptions}
        isRequired
      />
    </div>
  );
};

export default POModalInputs;
