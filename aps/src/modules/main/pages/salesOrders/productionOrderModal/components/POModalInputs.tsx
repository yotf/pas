/**
 * @module POModalInputs
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { FC } from 'react';
import { ProductionOrderModalForm } from '../../../settings/redux/productionOrders/productionOrdersModal/interfaces';
import { useProductionOrderModalOptions } from '../useProductionOrderModalOptions';

export type POModalInputsProps = {
  ns: string;
};
/**
 * @param ns Localization Namespace
 * @returns Production order modal inputs connected to the form defined in {@link useProductionOrderModal}
 */
const POModalInputs: FC<POModalInputsProps> = ({ ns }) => {
  const { translate } = useTranslate({ ns: ns });

  const { orderTypeOptions, routingOptions } = useProductionOrderModalOptions();

  const nameof = nameofFactory<ProductionOrderModalForm>();

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
        options={orderTypeOptions}
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
