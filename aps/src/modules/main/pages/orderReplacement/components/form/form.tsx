/**
 * @module OrderReplacementForm
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { mapDataToOptions, nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { OrderReplacementFormData } from '../../../settings/redux/orderReplacement/interfaces';
import { clearOrderReplacementData } from '../../../settings/redux/orderReplacement/slices';
import {
  getOrderReplacement,
  getSalesOrderByCustomer,
} from '../../../settings/redux/orderReplacement/thunks';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { useOrderReplacementValidationChecks } from '../../hooks/useOrderReplacementValidationChecks';
import { getAllCustomers } from '../../../settings/redux/customers/thunks';
import { DefaultOptionType } from 'antd/es/select';
import { SalesOrderResponse } from '../../../settings/redux/salesOrders/interfaces';

export interface FormProps {
  translate: (value: string, options?: Record<string, string> | undefined) => string;
}
/**
 * @param translate Localization function
 * @returns Order replacement form. Validates user inputs and sends API requests if entered data is valid
 */
const Form: FC<FormProps> = ({ translate }) => {
  const { inProductionOrders, outProductionOrders, inSalesOrders, outSalesOrders } = useAppSelector(
    (state) => state.orderReplacement.data,
  );
  const { data: customers } = useAppSelector((state) => state.customers);
  const [generateSubmitted, setGenerated] = useState<boolean>(false);

  const generateCallback = (generated: boolean) => {
    setGenerated(generated);
  };

  const customerOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(customers),
    [customers],
  );

  const form = useFormContext();
  const {
    formState: { isDirty, isValid, isSubmitted },
    getValues,
    watch,
    setValue,
    clearErrors,
  } = form;

  const { loading } = useAppSelector((state) => state.orderReplacement);

  const { inCustomerId, outCustomerId, outSalesOrderNumberId, inSalesOrderNumberId } = watch();

  console.log(getValues());

  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearOrderReplacementData());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (!outCustomerId) return;
    dispatch(getSalesOrderByCustomer({ id: outCustomerId, salesOrderType: 'out' }));
    setValue('outSalesOrderNumberId', '');
    clearErrors('outSalesOrderNumberId');
  }, [dispatch, outCustomerId, setValue]);

  useEffect(() => {
    if (!inCustomerId) return;
    dispatch(getSalesOrderByCustomer({ id: inCustomerId, salesOrderType: 'in' }));
    setValue('inSalesOrderNumberId', '');
    clearErrors('inSalesOrderNumberId');
  }, [dispatch, inCustomerId]);

  useEffect(() => {
    clearErrors('inSalesOrderNumberId');
  }, [outSalesOrderNumberId]);

  useEffect(() => {
    clearErrors('outSalesOrderNumberId');
  }, [inSalesOrderNumberId]);

  const inSalesOrderOptions: DefaultOptionType[] = useMemo(
    () =>
      inSalesOrders?.map((salesOrder: SalesOrderResponse) => {
        return {
          label: salesOrder.orderNumber,
          value: salesOrder.id,
        };
      }),
    [inSalesOrders],
  );

  const outSalesOrderOptions: DefaultOptionType[] = useMemo(
    () =>
      outSalesOrders?.map((salesOrder: SalesOrderResponse) => {
        return {
          label: salesOrder.orderNumber,
          value: salesOrder.id,
        };
      }),
    [outSalesOrders],
  );

  const nameOf = nameofFactory<OrderReplacementFormData>();

  const fetchOrderReplacement = useCallback(
    (data: OrderReplacementFormData): void => {
      dispatch(getOrderReplacement(data));
      setGenerated(true);
    },
    [dispatch],
  );

  const { openConfirmationModal, modal } = useConfirmationModal(translate);

  const replaceOrdersDisable = useMemo(
    () => !inProductionOrders?.length || !outProductionOrders?.length,
    [inProductionOrders, outProductionOrders],
  );

  const handleFetchOrderReplacement = useCallback(
    () => fetchOrderReplacement(getValues()),
    [fetchOrderReplacement, getValues],
  );

  useOrderReplacementValidationChecks(translate, generateCallback, generateSubmitted);

  return (
    <div className='form-container'>
      {loading && (generateSubmitted || isSubmitted) && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}
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
          options={outSalesOrderOptions}
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
          options={inSalesOrderOptions}
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
