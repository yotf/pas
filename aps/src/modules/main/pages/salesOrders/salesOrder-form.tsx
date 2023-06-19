/**
 * @module SalesOrderForm
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import { Status, statusOptions } from '@/modules/shared/consts';
import { DefaultOptionType } from 'antd/es/select';
import { FC, useContext, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomInput from '../../../shared/components/input/input.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { dateFormatter, nameofFactory } from '../../../shared/utils/utils';
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

  const { customerOptions, orderTypeOptions } = useSalesOrderOptions();

  const { tableAndModal, onAddMaterial } = useSalesOrderMaterialsModal();

  const { watch } = useFormContext();

  const { status } = watch();

  const isFormActive = useMemo(() => {
    return status === 1;
  }, [status]);

  const isEditing = useMemo(() => !!entity?.id, [entity?.id]);

  const statusOptionsTranslate = useMemo(
    () =>
      statusOptions.map((option: DefaultOptionType) => ({
        ...option,
        label: translate(Status[Number(option.value)]),
      })),
    [translate],
  );

  return (
    <div className='sales-order-container'>
      <div className='form-container'>
        <form
          className='salesOrder-form'
          data-testid='salesOrder-form'
          autoComplete='off'
          onSubmit={(e): void => e.preventDefault()}
        >
          {!!entity?.orderNumber && (
            <CustomInput
              type='readonly'
              label={translate('orderNumber')}
              name={nameof('orderNumber')}
              width='full-width'
            />
          )}
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('orderTypeId')}
            name={nameof('orderTypeId')}
            width='full-width'
            options={orderTypeOptions}
            disabled={!isFormActive}
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

          <CustomInput
            type='select'
            label={translate('customerId')}
            name={nameof('customerId')}
            options={customerOptions}
            width='full-width'
            disabled={!isFormActive}
            isRequired={true}
            isAutocomplete={true}
          />
          {!!entity?.id || <br />}
          <CustomInput
            type='text'
            label={translate('customerOrderNumber')}
            name={nameof('customerOrderNumber')}
            width='full-width'
            disabled={!isFormActive}
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
            />
          </div>
        </form>
        <div className='add-button'>
          <CustomButton
            customClass='action-button'
            color='blue'
            type='button'
            onClick={(): void => onAddMaterial()}
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
