/**
 * @module OperationsForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsPageItem } from '../../settings/consts/interfaces';
import { AllocationBased, OperationFormData } from '../../settings/redux/operations/interfaces';

export type OperationsFormType = {
  form: UseFormReturn<OperationFormData, any>;
};
/**
 * @param form Passed down through {@link OperationsLayout}. Controls and validated users' inputs.
 * @returns Operations Form component with {@link Input | inputs} connected to the form returned by {@link UseOperationMaintainSetup} hook.
 */
const OperationsForm: FC<OperationsFormType> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;
  const { operation_Id: operationId } = form.watch();

  const ns = 'operations';
  const { translate } = useTranslate({ ns: ns });
  const { translate: translateAllocation } = useTranslate({ ns: 'allocation_labels' });
  const { entity } = useAppSelector((state) => state.operation);
  const convertForDropdown = useCallback(
    (arr: (SettingsPageItem | AllocationBased)[] | undefined): DefaultOptionType[] => {
      if (arr === undefined) return [];
      return arr.map((item) => {
        return { label: translateAllocation(item.name), value: item.id };
      });
    },
    [translateAllocation],
  );

  const { allocationBased } = form.watch();

  const disableInput = allocationBased === 3;

  useEffect(() => {
    if (allocationBased === 3) {
      form.setValue('unitOfMeasureId', undefined, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [allocationBased, form]);

  return (
    <form
      data-testid='operations-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <div className='maintain-main'>
        <div className='maintain-main__inner centered'>
          <div className='maintain-left'>
            <div className='operation-id'>
              {!!operationId && (
                <div className='id-container'>
                  <p>{translate('operation_Id')}</p>
                  <p>{operationId || 'ㅤ'}</p>
                </div>
              )}
              <CustomSwitch label={translate('active')} name={register('isActive').name} />
            </div>
          </div>
          <div className='maintain-right'>
            <div className='interface-container'>
              <h2 className='mb-0'>{translate('interface')}</h2>
            </div>
          </div>
        </div>
        <div className='maintain-left'>
          <CustomInput
            error={errors.name}
            placeholder={translate('name')}
            type='text'
            isRequired={true}
            label={translate('name')}
            register={register('name')}
            width='full-width'
          />
          <CustomInput
            error={errors.departmentId}
            type='select'
            placeholder={translate('departmentName')}
            label={translate('departmentName')}
            register={register('departmentId')}
            options={convertForDropdown(entity?.departments)}
            width='full-width'
          />
          <CustomInput
            type='textarea'
            placeholder=''
            label={translate('remark')}
            register={register('remark')}
            width='full-width'
          />
        </div>
        <div className='maintain-right'>
          <CustomInput
            error={errors.interfaceCode}
            type='text'
            placeholder=''
            register={register('interfaceCode')}
            label={translate('interface_code')}
            width='full-width'
          />
          <div>
            <h3>{translate('allocation_based')}</h3>
            <CustomInput
              type='radio'
              placeholder=''
              register={register('allocationBased')}
              options={convertForDropdown(entity?.allocationBasedDtos)}
              width='full-width'
            />
          </div>
          <div className='operations-container'>
            <h2>{translate('operation_time')}</h2>
            <div className='times-grid'>
              <CustomInput
                error={errors.operationTime}
                type='number'
                placeholder=''
                register={register('operationTime')}
                label={translate('operationTime')}
                isRequired={true}
                width='full-width'
              />
              <CustomInput
                error={errors.unitOfMeasureId}
                type='select'
                placeholder={translate('unit_of_measure_placeholder')}
                label={translate('unit_of_measure_label')}
                register={register('unitOfMeasureId')}
                options={convertForDropdown(entity?.unitOfMeasures)}
                width='full-width'
                disabled={disableInput}
                isRequired={!disableInput}
              />
              <CustomInput
                error={errors.waitingTime}
                type='number'
                placeholder=''
                register={register('waitingTime')}
                label={translate('waitingTime')}
                width='full-width'
              />
              <CustomInput
                error={errors.setupTime}
                type='number'
                placeholder=''
                register={register('setupTime')}
                label={translate('setupTime')}
                width='full-width'
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OperationsForm;
