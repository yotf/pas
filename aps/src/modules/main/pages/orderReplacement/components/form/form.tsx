/**
 * @module OrderReplacementForm
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FC, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { OrderReplacementFormData } from '../../../settings/redux/orderReplacement/interfaces';
import { clearOrderReplacementData } from '../../../settings/redux/orderReplacement/slices';
import {
  getOrderReplacement,
  getSalesOrderReplacementForm,
} from '../../../settings/redux/orderReplacement/thunks';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { useOrderReplacementForm } from '../../hooks/useOrderReplacementForm';
import { useOrderReplacementValidationChecks } from '../../hooks/useOrderReplacementValidationChecks';

export interface FormProps {
  translate: (value: string, options?: Record<string, string> | undefined) => string;
}
/**
 * @param translate Localization function
 * @returns Order replacement form. Validates user inputs and sends API requests if entered data is valid
 */
const Form: FC<FormProps> = ({ translate }) => {
  const { inProductionOrders, outProductionOrders } = useAppSelector(
    (state) => state.orderReplacement.data,
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getSalesOrderReplacementForm());

    return () => {
      dispatch(clearOrderReplacementData());
    };
  }, [dispatch]);

  const nameOf = nameofFactory<OrderReplacementFormData>();

  const fetchOrderReplacement = useCallback(
    (data: OrderReplacementFormData): void => {
      dispatch(getOrderReplacement(data));
    },
    [dispatch],
  );

  const { openConfirmationModal, modal } = useConfirmationModal(translate);

  const replaceOrdersDisable = !(inProductionOrders.length || outProductionOrders.length);

  const form = useFormContext();
  const {
    formState: { isDirty, isValid },
    getValues,
  } = form;

  const handleFetchOrderReplacement = useCallback(
    () => fetchOrderReplacement(getValues()),
    [fetchOrderReplacement, getValues],
  );

  const { customerOptions, inSalesOrderNumbers, outSalesOrderNumbers } = useOrderReplacementForm();

  useOrderReplacementValidationChecks(translate);

  return (
    <div className='form-container'>
      <div className='order-placement-inputs'>
        <CustomInput
          type='select'
          isRequired={true}
          width={'full-width'}
          label={translate('outCustomer')}
          name={nameOf('outCustomerId')}
          isAutocomplete={true}
          options={customerOptions}
        />
        <CustomInput
          type='select'
          isRequired={true}
          width={'full-width'}
          label={translate('outSalesOrderNumber')}
          name={nameOf('outSalesOrderNumberId')}
          isAutocomplete={true}
          options={outSalesOrderNumbers}
        />
        <CustomInput
          type='select'
          isRequired={true}
          width={'full-width'}
          label={translate('inCustomer')}
          name={nameOf('inCustomerId')}
          isAutocomplete={true}
          options={customerOptions}
        />

        <CustomInput
          type='select'
          isRequired={true}
          width={'full-width'}
          label={translate('inSalesOrderNumber')}
          name={nameOf('inSalesOrderNumberId')}
          isAutocomplete={true}
          options={inSalesOrderNumbers}
        />
      </div>
      <div className='button-container'>
        <CustomButton
          type='button'
          color='blue'
          onClick={handleFetchOrderReplacement}
          isDisabled={!isValid || !isDirty}
        >
          <div className='button-children'>
            <span>{translate('generate_data')}</span>
          </div>
        </CustomButton>
        <CustomButton
          type='button'
          color='white'
          onClick={openConfirmationModal}
          isDisabled={replaceOrdersDisable}
        >
          <div className='button-children'>
            <span>{translate('replace_orders')}</span>
          </div>
        </CustomButton>
      </div>
      {modal}
    </div>
  );
};

export default Form;
