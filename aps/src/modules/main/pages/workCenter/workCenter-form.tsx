/**
 * @module WorkCenterForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsPageItem } from '../settings/consts/interfaces';
import { AllocationBased } from '../settings/redux/operations/interfaces';
import { WorkCenterFormData } from '../settings/redux/workCenters/interfaces';
import { useRadioChangeModal } from './hooks/useRadioChangeModal';
import { getConfiguration } from '../settings/redux/configuration/thunks';
import { AllocationBasedEnum } from '@/modules/shared/consts';
import {
  limitNumberOfChars,
  limitToNumericKeyDown,
  mapDataToOptions,
} from '@/modules/shared/utils/utils';

export type WorkCenterFormType = {
  form: UseFormReturn<WorkCenterFormData, any>;
};
/**
 * @returns Work Center Form component with {@link Input | inputs} connected to the form returned by {@link useWorkCenterMaintainSetup} hook.
 * When allocationBased value is changed a modal returned from {@link useRadioChangeModal} hook opens, asking for user confirmation. Confirming the action clears all allowed operations.
 *  */
const WorkCenterForm: FC<WorkCenterFormType> = ({ form }) => {
  const { entity } = useAppSelector((state) => state.workCenter);
  const { quantities1, defaultKg } = useAppSelector((state) => state.configuration.data);
  const ns = 'workCenters';
  const { translate } = useTranslate({ ns: ns });
  const dispatch = useAppDispatch();
  const { translate: translateAllocation } = useTranslate({ ns: 'allocation_labels' });
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    resetField,
  } = form;

  const [allocationChanged, setAllocationChanged] = useState<boolean>(false);

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

  // const UoMs = useMemo(() => {
  //   const unitOfMeasures = quantities1.map((q1) => q1.unitOfMeasure);
  //   const kgMeasure = defaultKg?.unitOfMeasure;
  //   return allocationBased === AllocationBasedEnum.quantity1
  //     ? mapDataToOptions(
  //         unitOfMeasures as SettingsPageItem[],
  //         entity?.unitOfMeasure
  //           ? { value: entity.unitOfMeasure.id!, label: entity.unitOfMeasure.name }
  //           : undefined,
  //       )
  //     : mapDataToOptions(kgMeasure ? [kgMeasure] : undefined);
  // }, [allocationBased, quantities1, entity?.unitOfMeasure, defaultKg]);

  const q1Options = useMemo(
    () =>
      mapDataToOptions(
        quantities1.map((q) => q.unitOfMeasure) as SettingsPageItem[],
        entity?.unitOfMeasure && entity.allocationBased !== AllocationBasedEnum.formula
          ? { label: entity?.unitOfMeasure.name, value: entity.unitOfMeasure.id! }
          : undefined,
      ),
    [entity?.unitOfMeasure, quantities1, defaultKg],
  );

  const kgOption = useMemo(
    () =>
      entity?.allocationBased === AllocationBasedEnum.formula && !allocationChanged
        ? [{ label: entity?.unitOfMeasure?.name, value: entity?.unitOfMeasure?.id }]
        : [
            {
              label: defaultKg?.unitOfMeasure?.name,
              value: defaultKg?.unitOfMeasure?.id,
            },
          ],
    [defaultKg, entity?.unitOfMeasure, entity?.allocationBased, allocationChanged],
  );

  const UoMdisabled = useMemo(
    () => allocationBased === AllocationBasedEnum.formula,
    [allocationBased],
  );

  // useEffect(() => {
  //   allocationBased === AllocationBasedEnum.formula
  //     ? setValue('unitOfMeasureId', UoMs?.[0]?.value as number)
  //     : resetField('unitOfMeasureId');
  // }, [allocationBased]);

  useEffect(() => {
    allocationBased === AllocationBasedEnum.formula
      ? setValue('unitOfMeasureId', kgOption[0].value)
      : entity?.allocationBased === AllocationBasedEnum.formula
      ? form.setValue('unitOfMeasureId', undefined)
      : form.resetField('unitOfMeasureId');
  }, [allocationBased]);
  const { openRadioChangeModal, radioChangeModal } = useRadioChangeModal({
    ns: ns,
    form: form,
    usedInPlanning: entity?.usedInPlanning!,
  });

  const handleRadioChange = (callback: () => void) => {
    setAllocationChanged(true);
    openRadioChangeModal(callback);
  };

  useEffect(() => {
    resetField('weightCapacity');
  }, [allocationBased]);

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
              <p>{form.getValues('workCenter_Id') || 'ㅤ'}</p>
            </div>
          </div>
        )}
        <CustomSwitch label={translate('active')} name={register('isActive').name} />
        <CustomInput
          error={errors.workCenterInterfaceId}
          placeholder={translate('workCenterInterfaceId')}
          type='text'
          label={translate('workCenterInterfaceId')}
          register={register('workCenterInterfaceId')}
          width='full-width'
          maxLength={15}
        />
        <div className='wc-name'>
          <CustomInput
            error={errors.name}
            placeholder={translate('workcenter_name')}
            type='text'
            isRequired={true}
            label={translate('workcenter_name')}
            register={register('name')}
            width='full-width'
            maxLength={30}
          />
        </div>
        <div className='grid-start'>
          <h3>{translate('allocationBasedName')}</h3>
          <CustomInput
            type='radio'
            placeholder=''
            register={register('allocationBased')}
            options={convertForDropdown(entity?.allocations)}
            width='full-width'
            customChangeEvent={handleRadioChange}
          />
        </div>

        <CustomInput
          error={errors.departmentId}
          type='select'
          placeholder={translate('departmentName')}
          label={translate('departmentName')}
          register={register('departmentId')}
          options={mapDataToOptions(
            entity?.departments,
            entity?.department
              ? { value: entity.department.id!, label: entity.department.name }
              : undefined,
          )}
          width='full-width'
          isRequired={true}
        />
        <div className={UoMdisabled ? 'formula-uom' : 'q1-uom'}>
          <CustomInput
            error={errors.unitOfMeasureId}
            type='select'
            placeholder={
              UoMdisabled ? translate('unitOfMeasureName') : translate('unitOfQuantityName')
            }
            label={UoMdisabled ? translate('unitOfMeasureName') : translate('unitOfQuantityName')}
            register={register('unitOfMeasureId')}
            options={allocationBased === AllocationBasedEnum.formula ? kgOption : q1Options}
            width='full-width'
            disabled={UoMdisabled}
            readOnly={UoMdisabled}
          />
        </div>

        {UoMdisabled ? (
          <CustomInput
            type='text'
            placeholder={translate('weightCapacity')}
            label={translate('weightCapacity')}
            register={register('weightCapacity')}
            width='full-width'
            isRequired={UoMdisabled}
            maxLength={5}
            onKeyDownEvent={(e) => {
              limitToNumericKeyDown(e);
            }}
          />
        ) : null}

        <CustomInput
          type='textarea'
          placeholder=''
          label={translate('remark')}
          register={register('remark')}
          width='full-width'
          onKeyDownEvent={(e) => limitNumberOfChars(e, 200)}
        />
      </div>
      {radioChangeModal}
    </form>
  );
};

export default WorkCenterForm;
