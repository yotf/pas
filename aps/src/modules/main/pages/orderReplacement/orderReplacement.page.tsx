/**
 * @module OrderReplacementPage
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderReplacementFormData } from '../settings/redux/orderReplacement/interfaces';
import Form from './components/form/form';
import ProductionOrdersTable from './components/productionOrdersTable/productionOrdersTable.component';
import { useOrderReplacementSchema } from './hooks/useOrderReplacementSchema';
import './orderReplacement.page.scss';
import { useAppSelector } from '@/store/hooks';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
/**
 * Creates a form using useForm hook with a validation schema provided by the {@link useOrderReplacementSchema}.
 * Two {@link ProductionOrdersTable} components are used to present in and out data for selected customers and sales orders.
 * @returns Layout for order replacement page wrapped in a form provider.
 */
const OrderReplacementPage: FC = () => {
  const validationScheme = useOrderReplacementSchema();

  const [replaced, setReplaced] = useState<boolean>(false);

  const { data, loading, error } = useAppSelector((state) => state.orderReplacement);

  const form = useForm<OrderReplacementFormData>({
    resolver: yupResolver(validationScheme),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (loading) return;
    if (error) {
      notificationFail(error);
    } else {
      if (data.inProductionOrders.length === 0 && data.outProductionOrders.length === 0) {
        notificationFail(translate('no_POs'));
        return;
      }
      if (data.inProductionOrders.length === 0) {
        notificationFail(translate('no_IN_orders'));
        return;
      }
      if (data.outProductionOrders.length === 0) {
        notificationFail(translate('no_OUT_orders'));
        return;
      }

      notificationSuccess(
        replaced ? translate('replacement_success') : translate('order_load_success'),
      );
      setReplaced(false);
    }
  }, [error, loading]);

  const { translate } = useTranslate({ ns: 'orderReplacement' });

  const replaceCallback = () => {
    setReplaced(true);
  };

  return (
    <FormProvider {...form}>
      <div className='order-replacement-container'>
        <h2 className='table-container__title'>{translate('title')}</h2>
        <Form translate={translate} replaceCallback={replaceCallback} />
        <div className='production-orders-table-container'>
          <ProductionOrdersTable tableType='out' />
          <ProductionOrdersTable tableType='in' />
        </div>
      </div>
    </FormProvider>
  );
};

export default OrderReplacementPage;
