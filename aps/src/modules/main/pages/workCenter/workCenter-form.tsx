/**
 * @module WorkCenterForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsPageItem } from '../settings/consts/interfaces';
import { AllocationBased } from '../settings/redux/operations/interfaces';
import { WorkCenterFormData } from '../settings/redux/workCenters/interfaces';
import { useRadioChangeModal } from './hooks/useRadioChangeModal';
import { getConfig } from '@testing-library/react';
import { getConfiguration } from '../settings/redux/configuration/thunks';
import { AllocationBasedEnum } from '@/modules/shared/consts';

export type WorkCenterFormType = {
  form: UseFormReturn<WorkCenterFormData, any>;
};
/**
 * @returns Work Center Form component with {@link Input | inputs} connected to the form returned by {@link useWorkCenterMaintainSetup} hook.
 * When allocationBased value is changed a modal returned from {@link useRadioChangeModal} hook opens, asking for user confirmation. Confirming the action clears all allowed operations.
 *  */
const WorkCenterForm: FC<WorkCenterFormType> = ({ form }) => {
  const { entity } = useAppSelector((state) => state.workCenter);
  const { quantities1 } = useAppSelector((state) => state.configuration.data);
  const ns = 'workCenters';
  const { translate } = useTranslate({ ns: ns });
  const dispatch = useAppDispatch();
  const { translate: translateAllocation } = useTranslate({ ns: 'allocation_labels' });
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const { allocationBased } = watch();

  const convertForDropdown = useCallback(
    (arr: (SettingsPageItem | AllocationBased)[] | undefined): DefaultOptionType[] => {
      if (arr === undefined) return [];
      return arr.map((item) => {
        return { label: translateAllocation(item.name), value: item.id };
      });
    },
    [translateAllocation],
  );

  useEffect(() => {
    dispatch(getConfiguration());
  }, [dispatch]);

  const UoMs = useMemo(() => {
    const unitOfMeasures = quantities1.map((q1) => q1.unitOfMeasure);
    const kgMeasure = quantities1?.find((uom) => uom.isKg)?.unitOfMeasure;
    return allocationBased === AllocationBasedEnum.quantity1
      ? convertForDropdown(unitOfMeasures)
      : convertForDropdown(kgMeasure ? [kgMeasure] : undefined);
  }, [allocationBased, quantities1]);

  const UoMdisabled = useMemo(
    () => allocationBased === AllocationBasedEnum.formula,
    [allocationBased],
  );

  useEffect(() => {
    allocationBased === AllocationBasedEnum.formula
      ? setValue('unitOfMeasureId', UoMs?.[0].value as number)
      : null;
  }, [allocationBased]);

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
        <div>
          <CustomInput
            error={errors.unitOfMeasureId}
            type='select'
            placeholder={translate('unitOfMeasureName')}
            label={translate('unitOfMeasureName')}
            register={register('unitOfMeasureId')}
            options={UoMs}
            width='full-width'
            disabled={UoMdisabled}
            readOnly={UoMdisabled}
          />

          {UoMdisabled ? (
            <CustomInput
              type='text'
              placeholder={translate('weightCapacity')}
              label={translate('weightCapacity')}
              register={register('weightCapacity')}
              width='full-width'
              isRequired={UoMdisabled}
            />
          ) : null}
        </div>
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
