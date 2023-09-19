/**
 * @module SalesOrderForm
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { Status, statusOptions } from '@/modules/shared/consts';
import { DefaultOptionType } from 'antd/es/select';
import { FC, useContext, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomInput from '../../../shared/components/input/input.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { dateFormatter, limitNumberOfChars, nameofFactory } from '../../../shared/utils/utils';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import {
  SalesOrder,
  SalesOrderFormData,
  SalesOrderResponse,
} from '../settings/redux/salesOrders/interfaces';
import { useSalesOrderOptions } from './hooks/useSalesOrderOptions';
import './salesOrder-form.scss';
import { useSalesOrderMaterialsModal } from './salesOrderMaterials-table';
import dayjs from 'dayjs';
import { SalesOrderMaterialDto } from '../settings/redux/productionOrders/interfaces';
import { latest } from 'immer/dist/internal';
import { useAppSelector } from '@/store/hooks';
import { LoadingOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
/**
 * @returns Sales Order Form component with {@link Input | inputs} connected to the form returned by {@link useSalesOrderForm} hook.
 */
const SalesOrderForm: FC = () => {
  const {
    ns,
    state: { entity },
  } =
    useContext<MaintainContextValue<SalesOrder, SalesOrderResponse, SalesOrderFormData>>(
      MaintainContext,
    );
  const { translate } = useTranslate({ ns });

  const nameof = nameofFactory<SalesOrderFormData>();
  const { watch, setValue } = useFormContext();

  const { loading } = useAppSelector((state) => state.productionOrdersModal);

  const { salesOrderMaterialsAddAndUpdate } = watch();

  const { customerOptions, orderTypeOptions } = useSalesOrderOptions(entity);

  const isEditing = useMemo(() => !!entity?.id, [entity?.id]);

  const isFormActive = useMemo(() => {
    return entity?.status === 1 || !isEditing;
  }, [entity?.status, isEditing]);

  const { tableAndModal, onAddMaterial } = useSalesOrderMaterialsModal({ isFormActive });

  const statusOptionsTranslate = useMemo(
    () =>
      statusOptions.map((option: DefaultOptionType) => ({
        ...option,
        label: translate(Status[Number(option.value)]),
      })),
    [translate],
  );

  useEffect(() => {
    console.log(salesOrderMaterialsAddAndUpdate);

    const latestRequestedDate = salesOrderMaterialsAddAndUpdate?.reduce(
      (latest: SalesOrderMaterialDto, material: SalesOrderMaterialDto) => {
        const currentDate = dayjs(material.requestedDelivery);
        return !latest || currentDate.isAfter(latest.requestedDelivery) ? currentDate : latest;
      },
      null,
    );

    setValue(
      'salesOrderDelivery',
      !!latestRequestedDate && latestRequestedDate.isValid()
        ? latestRequestedDate?.toISOString()
        : undefined,
    );
  }, [salesOrderMaterialsAddAndUpdate, setValue]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 20,
        color: 'white',
      }}
      spin
    />
  );

  return (
    <div className='sales-order-container'>
      <div className='form-container'>
        <form
          className={'salesOrder-form ' + (!entity?.id ? ' new' : '')}
          data-testid='salesOrder-form'
          autoComplete='off'
          onSubmit={(e): void => e.preventDefault()}
        >
          {loading && (
            <div className='spinner-overlay'>
              <Spin size='large' />
            </div>
          )}

          {!!entity?.orderNumber && (
            <div className='orderNumber'>
              <CustomInput type='readonly' name={nameof('orderNumber')} width='full-width' />
            </div>
          )}
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('orderTypeId')}
            name={nameof('orderTypeId')}
            width='full-width'
            options={orderTypeOptions}
            disabled={!isFormActive}
            readOnly={!isFormActive}
          />

          <CustomInput
            type='select'
            label={translate('customerId')}
            name={nameof('customerId')}
            options={customerOptions}
            width='full-width'
            disabled={!isFormActive}
            readOnly={!isFormActive}
            isRequired={true}
            isAutocomplete={true}
          />
          {!!entity?.id && (
            <>
              <CustomInput
                type='readonly'
                label={translate('createdOn')}
                value={dateFormatter(entity.changeHistoryDto.createdOn)}
                width='full-width'
              />
            </>
          )}
          {!!entity?.id || <br />}
          <CustomInput
            type='text'
            label={translate('customerOrderNumber')}
            name={nameof('customerOrderNumber')}
            width='full-width'
            disabled={!isFormActive}
            readOnly={!isFormActive}
            maxLength={20}
          />
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('status')}
            name={nameof('status')}
            width='full-width'
            options={statusOptionsTranslate}
            disabled={!isEditing}
            readOnly={!isEditing}
          />
          <div className='remark'>
            <CustomInput
              type='textarea'
              label={translate('remark')}
              name={nameof('remark')}
              width='full-width'
              disabled={!isFormActive}
              readOnly={!isFormActive}
              onKeyDownEvent={(e) => limitNumberOfChars(e, 200)}
            />
          </div>
        </form>
        <div className='add-button'>
          <CustomButton
            customClass='action-button'
            color='blue'
            type='button'
            onClick={(): void => onAddMaterial()}
            isDisabled={!isFormActive}
          >
            <div className='button-children'>
              <span>{translate('add_material')}</span>
            </div>
          </CustomButton>
        </div>
      </div>
      <div className='salesOrder-table'>{tableAndModal}</div>
    </div>
  );
};

export default SalesOrderForm;
