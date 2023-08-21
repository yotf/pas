/**
 * @module RoutesModal
 */

import { useModalProps } from '@/modules/shared/hooks/useModalProps.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Modal } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useContext, useEffect, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../../shared/components/input/input.component';
import CustomSwitch from '../../../shared/components/input/switch/switch.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import {
  handleTimeFormatKeyDown,
  limitNumberOfChars,
  limitToNumericKeyDown,
  mapDataToOptions,
  nameofFactory,
} from '../../../shared/utils/utils';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import { getAllOperations } from '../settings/redux/operations/thunks';
import {
  Routing,
  RoutingFormData,
  RoutingResponse,
  RoutingRouteFormData,
} from '../settings/redux/routings/interfaces';
import { useRoutingRouteForm } from './hooks/useRoutingRouteForm';
import './routes-modal.scss';

export type Props = {
  route?: RoutingRouteFormData;
  onClose: () => void;
  option?: 'create' | 'edit';
};
/**
 *
 * @param route Route selected by user when triggering the on edit function in the {@link RoutesTable} component.
 * @param option Defines if a new route is created or an existing one is being edited
 * @param onClose Clears selected routing route and closes the modal
 * @returns A modal for deleting and editing routing routes. The onOk function will change routing routes which are defined in the main form
 */
const RoutesModal: FC<Props> = ({ route, onClose, option }) => {
  const { ns } =
    useContext<MaintainContextValue<Routing, RoutingResponse, RoutingFormData>>(MaintainContext);
  const { translate } = useTranslate({ ns, keyPrefix: 'routes.modal' });
  const { form, onSubmit } = useRoutingRouteForm({ route, onClose, option });
  const buttonProps = useModalProps<RoutingRouteFormData>(form);
  const nameof = nameofFactory<RoutingRouteFormData>();
  const { data: operations } = useAppSelector((state) => state.operation);
  const { register } = form;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!operations.length) {
      dispatch(getAllOperations());
    }
  }, [dispatch, operations.length]);
  const operationOptions: DefaultOptionType[] = useMemo(
    () => mapDataToOptions(operations),
    [operations],
  );

  return (
    <FormProvider {...form}>
      <Modal
        {...buttonProps}
        className='routes-modal'
        centered
        open={!!route}
        title={option == 'edit' ? translate('edit_operation') : translate('add_operation')}
        okText={translate('save')}
        onOk={onSubmit}
        cancelText={translate('cancel')}
        onCancel={onClose}
        transitionName=''
      >
        <div className='colspan'>
          <CustomInput
            type='select'
            label={translate('search')}
            name={nameof('operationId')}
            options={operationOptions}
            width='full-width'
            isAutocomplete={true}
            isRequired={true}
            allowClear={true}
          />
        </div>
        <CustomInput
          type='readonly'
          label={translate('operation_id')}
          name={nameof('operationId')}
        />
        <CustomInput
          type='tel'
          pattern='[0-9]*'
          label={translate('sequence')}
          name={nameof('sequence')}
          register={register('sequence')}
          isRequired={true}
          maxLength={3}
        />
        <CustomInput
          isRequired={true}
          type='tel'
          label={translate('standardTime')}
          name={nameof('standardTime')}
          onKeyDownEvent={handleTimeFormatKeyDown}
        />
        <CustomInput
          type='tel'
          label={translate('setupTime')}
          name={nameof('setupTime')}
          onKeyDownEvent={handleTimeFormatKeyDown}
        />
        <CustomInput
          type='tel'
          label={translate('waitingTime')}
          name={nameof('waitingTime')}
          onKeyDownEvent={handleTimeFormatKeyDown}
        />
        <CustomInput
          isRequired={true}
          type='tel'
          pattern='[0-9]*'
          label={translate('leadTime')}
          name={nameof('leadTime')}
          maxLength={2}
          onKeyDownEvent={limitToNumericKeyDown}

        />
        <CustomInput
          type='readonly'
          label={translate('departmentName')}
          name={nameof('departmentName')}
        />
        <CustomSwitch label={translate('planning')} name={nameof('planning')} />
        <div className='colspan'>
          <CustomInput
            type='textarea'
            label={translate('remark')}
            name={nameof('remark')}
            width='full-width'
            onKeyDownEvent={(e) => limitNumberOfChars(e, 200)}
          />
        </div>
      </Modal>
    </FormProvider>
  );
};

export default RoutesModal;
