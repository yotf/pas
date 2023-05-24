/**
 * @module WorkCenterForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsPageItem } from '../settings/consts/interfaces';
import { AllocationBased } from '../settings/redux/operations/interfaces';
import { WorkCenterFormData } from '../settings/redux/workCenters/interfaces';
import { useRadioChangeModal } from './hooks/useRadioChangeModal';

export type WorkCenterFormType = {
  form: UseFormReturn<WorkCenterFormData, any>;
};
/**
 * @returns Work Center Form component with {@link Input | inputs} connected to the form returned by {@link useWorkCenterMaintainSetup} hook.
 * When allocationBased value is changed a modal returned from {@link useRadioChangeModal} hook opens, asking for user confirmation. Confirming the action clears all allowed operations.
 *  */
const WorkCenterForm: FC<WorkCenterFormType> = ({ form }) => {
  const { entity } = useAppSelector((state) => state.workCenter);
  const ns = 'workCenters';
  const { translate } = useTranslate({ ns: ns });
  const { translate: translateAllocation } = useTranslate({ ns: 'allocation_labels' });
  const {
    register,
    formState: { errors },
  } = form;
  const convertForDropdown = useCallback(
    (arr: (SettingsPageItem | AllocationBased)[] | undefined): DefaultOptionType[] => {
      if (arr === undefined) return [];
      return arr.map((item) => {
        return { label: translateAllocation(item.name), value: item.id };
      });
    },
    [translateAllocation],
  );
  const { openRadioChangeModal, radioChangeModal } = useRadioChangeModal({ ns: ns, form: form });

  return (
    <form
      data-testid='workcenters-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <div className='workcenters-main'>
        {!!form.getValues('workCenter_Id') && (
          <div className='workcenter-id'>
            <div className='id-container'>
              <p>{translate('id')}</p>
              <p>{form.getValues('workCenter_Id') || 'ㅤ'}</p>
            </div>
          </div>
        )}
        <CustomInput
          error={errors.name}
          placeholder={translate('workcenter_name')}
          type='text'
          isRequired={true}
          label={translate('workcenter_name')}
          register={register('name')}
          width='full-width'
        />
        <CustomInput
          error={errors.workCenterInterfaceId}
          placeholder={translate('workCenterInterfaceId')}
          type='text'
          label={translate('workCenterInterfaceId')}
          register={register('workCenterInterfaceId')}
          width='full-width'
        />
        <CustomSwitch label={translate('active')} name={register('isActive').name} />
        <CustomInput
          error={errors.departmentId}
          type='select'
          placeholder={translate('departmentName')}
          label={translate('departmentName')}
          register={register('departmentId')}
          options={convertForDropdown(entity?.departments)}
          width='full-width'
          isRequired={true}
        />
        <CustomInput
          error={errors.unitOfMeasureId}
          type='select'
          placeholder={translate('unitOfMeasureName')}
          label={translate('unitOfMeasureName')}
          register={register('unitOfMeasureId')}
          options={convertForDropdown(entity?.unitOfMeasures)}
          width='full-width'
        />
        <div className='grid-start'>
          <h3>{translate('allocationBasedName')}</h3>
          <CustomInput
            type='radio'
            placeholder=''
            register={register('allocationBased')}
            options={convertForDropdown(entity?.allocations)}
            width='full-width'
            customChangeEvent={openRadioChangeModal}
          />
        </div>
        <CustomInput
          type='textarea'
          placeholder=''
          label={translate('remark')}
          register={register('remark')}
          width='full-width'
        />
      </div>
      {radioChangeModal}
    </form>
  );
};

export default WorkCenterForm;
