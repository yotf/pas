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

/**
 * Creates a form using useForm hook with a validation schema provided by the {@link useOrderReplacementSchema}.
 * Two {@link ProductionOrdersTable} components are used to present in and out data for selected customers and sales orders.
 * @returns Layout for order replacement page wrapped in a form provider.
 */
const OrderReplacementPage: FC = () => {
  const validationScheme = useOrderReplacementSchema();

  const form = useForm<OrderReplacementFormData>({
    resolver: yupResolver(validationScheme),
    mode: 'onBlur',
  });

  const { translate } = useTranslate({ ns: 'orderReplacement' });



  return (
    <FormProvider {...form}>
     
      <div className='order-replacement-container'>
        <h2 className='table-container__title'>{translate('title')}</h2>
        <Form translate={translate} />
        <div className='production-orders-table-container'>
          <ProductionOrdersTable tableType='out' />
          <ProductionOrdersTable tableType='in' />
        </div>
      </div>
    </FormProvider>
  );
};

export default OrderReplacementPage;
