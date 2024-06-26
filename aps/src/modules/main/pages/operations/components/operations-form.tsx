/**
 * @module OperationsForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsPageItem } from '../../settings/consts/interfaces';
import { AllocationBased, OperationFormData } from '../../settings/redux/operations/interfaces';
import { AllocationBasedEnum } from '@/modules/shared/consts';
import {
  handleTimeFormatKeyDown,
  limitNumberOfChars,
  mapDataToOptions,
} from '@/modules/shared/utils/utils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { getConfiguration } from '../../settings/redux/configuration/thunks';

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
    setValue,
  } = form;
  const { operation_Id: operationId } = form.watch();

  const ns = 'operations';
  const { translate } = useTranslate({ ns: ns });
  const { translate: translateAllocation } = useTranslate({ ns: 'allocation_labels' });
  const { entity, error } = useAppSelector((state) => state.operation);
  const { data: configuration } = useAppSelector((state) => state.configuration);
  const [allocationModelOpened, setIsAllocationModalOpened] = useState<boolean>(false);
  const [allocationChanged, setAllocationChanged] = useState<boolean>(false);
  const dispatch = useAppDispatch();
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

  const { allocationBased } = form.watch();

  const disableInput = useMemo(
    () => allocationBased === AllocationBasedEnum.formula,
    [allocationBased],
  );

  const q1Options = useMemo(
    () =>
      mapDataToOptions(
        configuration.quantities1.map((q) => q.unitOfMeasure) as SettingsPageItem[],
        entity?.unitOfMeasure && entity.allocationBased !== AllocationBasedEnum.formula
          ? { label: entity?.unitOfMeasure.name, value: entity.unitOfMeasure.id! }
          : undefined,
      ),
    [
      entity?.unitOfMeasure,
      configuration.quantities1,
      configuration.defaultKg,
    ],
  );

  const kgOption = useMemo(
    () =>
      entity?.allocationBased === AllocationBasedEnum.formula && !allocationChanged
        ? [{ label: entity.unitOfMeasure.name, value: entity.unitOfMeasure.id }]
        : [
            {
              label: configuration.defaultKg?.unitOfMeasure?.name,
              value: configuration.defaultKg?.unitOfMeasure?.id,
            },
          ],
    [configuration.defaultKg, entity?.unitOfMeasure, entity?.allocationBased, allocationChanged],
  );

  const handleAllocationBasedChange = (callback: () => void) => {
    setAllocationChanged(true);
    if (entity?.usedInPlanning || entity?.usedInWorkCenter) {
      setIsAllocationModalOpened(true);
    } else {
      callback();
    }
  };

  const closeAllocationModal = () => {
    setIsAllocationModalOpened(false);
  };

  useEffect(() => {
    allocationBased === AllocationBasedEnum.formula
      ? setValue('unitOfMeasureId', kgOption[0].value)
      : entity?.allocationBased === AllocationBasedEnum.formula
      ? form.setValue('unitOfMeasureId', undefined)
      : form.resetField('unitOfMeasureId');
  }, [allocationBased]);

  return (
    <form
      data-testid='operations-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <div className='maintain-main'>
        <Modal
          centered
          okText='OK'
          open={allocationModelOpened}
          closable={true}
          footer={null}
          onCancel={closeAllocationModal}
        >
          <div className='confirm-modal-content info'>
            <InfoCircleOutlined style={{ color: '#749efa', fontSize: '16px' }} />
            <span>
              {entity?.usedInPlanning
                ? translate('radio_cant_change_text')
                : translate('allowed_in_work_center')}
            </span>
          </div>
        </Modal>
        <div className='maintain-main__inner centered'>
          <div className='maintain-left'>
            <div className='operation-id'>
              {!!operationId && (
                <div className='id-container'>
                  {/* <p>{translate('operation_Id')}</p> */}
                  <p>{operationId || 'ㅤ'}</p>
                </div>
              )}
              <CustomSwitch label={translate('active')} name={register('isActive').name} />
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
            maxLength={30}
          />
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
          />
          <CustomInput
            type='textarea'
            placeholder=''
            label={translate('remark')}
            register={register('remark')}
            width='full-width'
            onKeyDownEvent={(e) => limitNumberOfChars(e, 200)}
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
            maxLength={20}
          />
          <div>
            <h3>{translate('allocation_based')}</h3>
            <CustomInput
              type='radio'
              placeholder=''
              register={register('allocationBased')}
              options={convertForDropdown(entity?.allocationBasedDtos)}
              width='full-width'
              customChangeEvent={handleAllocationBasedChange}
            />
          </div>
          <div className='operations-container'>
            <h2>{translate('operation_time')}</h2>
            <div className='times-grid'>
              <CustomInput
                error={errors.operationTime}
                type='tel'
                pattern='[0-9]*\.?[0-9]*'
                placeholder=''
                register={register('operationTime')}
                label={translate('operationTime')}
                isRequired={true}
                width='full-width'
                onKeyDownEvent={handleTimeFormatKeyDown}
              />
              <CustomInput
                error={errors.unitOfMeasureId}
                type='select'
                placeholder={translate('unit_of_measure_placeholder')}
                label={
                  allocationBased === AllocationBasedEnum.formula
                    ? translate('unit_of_formula_label')
                    : translate('unit_of_measure_label')
                }
                register={register('unitOfMeasureId')}
                options={allocationBased === AllocationBasedEnum.formula ? kgOption : q1Options}
                width='full-width'
                disabled={disableInput}
                isRequired={true}
              />
              <CustomInput
                error={errors.waitingTime}
                type='tel'
                pattern='[0-9]*\.?[0-9]*'
                onKeyDownEvent={handleTimeFormatKeyDown}
                placeholder=''
                register={register('waitingTime')}
                label={translate('waitingTime')}
                width='full-width'
              />
              <CustomInput
                error={errors.setupTime}
                type='tel'
                pattern='[0-9]*\.?[0-9]*'
                onKeyDownEvent={handleTimeFormatKeyDown}
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
