/**
 * @module SingleProductionOrder
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { DeleteOutlined } from '@ant-design/icons';
import { FC, useEffect } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { UseFieldArrayRemove } from 'react-hook-form/dist/types';
import { ProductionOrderModalForm } from '../../../settings/redux/productionOrders/productionOrdersModal/interfaces';

export type SingleProductionOrderProps = {
  index: number;
  ns: string;
  factorAreaToPc: number | undefined;
  remove: UseFieldArrayRemove;
};
/**
 *
 * @param index Index of the production order. Used to track its values with useFieldArray hook from React Hook Form
 * @param ns Localization Namespace
 * @param factorAreaToPc Extracted from selected material
 * @param remove Remove function for deleting a production order modal. Extracted from useFieldArray hook
 * @returns One Production Order to be created with its quantity 2 calculated. Initial values of the production order are defined in {@link usePOModalInitialValues} hook.
 * Values are then modified with user inputs in {@link POModalInputs}
 */
const SingleProductionOrder: FC<SingleProductionOrderProps> = ({
  index,
  ns,
  factorAreaToPc,
  remove,
}): JSX.Element => {
  const { translate } = useTranslate({ ns: ns });

  const form: UseFormReturn<ProductionOrderModalForm, any> = useFormContext();

  const { watch, setValue } = form;

  const { productionOrders } = watch();

  const quantity1 = productionOrders[index].quantity1;

  useEffect(() => {
    setValue(`productionOrders.${index}.quantity2`, quantity1! / (factorAreaToPc || 1));
  }, [factorAreaToPc, index, quantity1, setValue]);

  return (
    <>
      <div className='units-container'>
        <div className='units'>
          <span>
            <CustomInput
              maxLength={6}
              type={'text'}
              name={`productionOrders[${index}].quantity1`}
            />
          </span>
          <p>/m2- </p>
          <p>
            {productionOrders[index].quantity2?.toFixed(2)} /{translate('pieces')}
          </p>
        </div>
      </div>
      <CustomSwitch name={`productionOrders[${index}].statusOfPlanningBoolean`} label='' />

      <DeleteOutlined onClick={(): void => remove(index)} />
    </>
  );
};

export default SingleProductionOrder;
