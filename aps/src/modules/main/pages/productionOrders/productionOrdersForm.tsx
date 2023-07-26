/**
 * @module ProductionOrderForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import warningIcon from '@/assets/warning.svg';
import {
  POFormStatus,
  situationDropdownOptions,
  statusDropdownOptions,
} from '@/modules/shared/consts';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/es/cascader';
import dayjs from 'dayjs';
import { FC, useContext, useEffect, useId, useMemo, useState } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import RoutesTable from '../routings/routes-table';
import '../routings/routes-table.scss';
import {
  ProductionOrder,
  ProductionOrderFormData,
  ProductionOrderResponse,
} from '../settings/redux/productionOrders/interfaces';
import { RoutingRoute, RoutingRouteFormData } from '../settings/redux/routings/interfaces';
import { getRouting } from '../settings/redux/routings/thunks';
import { useProductionOrderOptions } from './hooks/useProductionOrderOptions';
import './productionOrdersForm.scss';
import { Modal } from 'antd';

/**
 * The form reuses {@link RoutesTable} logic. The useEffect hooks are used to modifiy form values which are dependent on one another (for example when material changes so does routing and that changes the routing table operations).
 * The {@link useProductionOrderOptions} hook provides options for select inputs.
 * @returns Production orders Form component with {@link Input | inputs} connected to the form returned by {@link useProductionOrderForm} hook.
 */

type pendingFieldType = {
  value: number | undefined;
  id: 'routingId' | 'materialId' | undefined;
};

type POProps = {
  discardOperations: boolean;
  updateDiscardOperations: (value: boolean) => void;
  copy: boolean | undefined;
};
const ProductionOrderForm: FC<POProps> = (props) => {
  const {
    ns,
    state: { entity },
  } =
    useContext<
      MaintainContextValue<ProductionOrder, ProductionOrderResponse, ProductionOrderFormData>
    >(MaintainContext);
  const { discardOperations, updateDiscardOperations, copy } = props;
  const { translate } = useTranslate({ ns });
  const { data: materials } = useAppSelector((state) => state.materials);
  const { data: salesOrders } = useAppSelector((state) => state.salesOrders);
  const { entity: selectedRouting } = useAppSelector((state) => state.routings);

  const [discardOperationModalVisible, setDiscardOperationModalVisible] = useState<boolean>(false);
  const [pendingValue, setPendingValue] = useState<pendingFieldType>();
  const dispatch = useAppDispatch();

  const nameof = nameofFactory<ProductionOrderFormData>();

  const {
    customerOptions,
    orderTypeOptions,
    materialOptions,
    routingOptions,
    unitOfMeasureOptions,
    materialGroupOptions,
    colorOptions,
    articleOptions,
    selectionOptions,
    thicknessOptions,
    salesOrderSequenceOptions,
    originPOOptions,
  } = useProductionOrderOptions(entity);

  const form = useFormContext<ProductionOrderFormData>();

  const { watch, setValue, getValues } = form;

  const {
    quantity1,
    foreseenDelivery,
    finalDelivery,
    foreseenDeliveryPOOrigin,
    routingId,
    salesOrderDelivery,
    routingAddAndUpdateOperations,
    statusOfPlanningEnum,
    salesOrderSequence,
  } = watch();

  const initialDateDisabled = useMemo(() => !!entity?.origin, [entity?.origin]);
  const isEditing = useMemo(() => !!entity?.id, [entity?.id]);
  const isPlanned = useMemo(
    () => !!entity?.id && statusOfPlanningEnum == POFormStatus.planned,
    [entity?.id, entity?.statusOfPlanningEnum, statusOfPlanningEnum],
  );

  const translateMapper = (array: DefaultOptionType[]): DefaultOptionType[] => {
    return array.map((option: DefaultOptionType) => ({
      label: translate(String(option.label)),
      value: option.value,
    }));
  };

  const { materialId, salesOrderId } = watch();

  const materialMeasures = useMemo(
    () => materials.find((material) => material.id === materialId),
    [materialId, materials],
  );

  const selectedSalesOrder = useMemo(
    () => salesOrders.find((salesOrder) => salesOrder.id === salesOrderId),
    [salesOrderId, salesOrders],
  );

  useEffect(() => {
    setValue('unitOfMeasure1Id', materialMeasures?.unitOfMeasure1?.id || undefined);
    setValue('unitOfMeasure2Id', materialMeasures?.unitOfMeasure2?.id || undefined);
    setValue('unitOfMeasure3Id', materialMeasures?.unitOfMeasure1?.id || undefined); //TODO use default value from configurator
  }, [materialMeasures, setValue]);

  useEffect(() => {
    setValue('materialGroupId', materialMeasures?.materialGroupId);
    setValue('articleId', materialMeasures?.articleId);
    setValue('colorId', materialMeasures?.colorId);
    setValue('thicknessId', materialMeasures?.thicknessId);
    setValue('selectionId', materialMeasures?.selectionId);
  }, [materialMeasures, setValue]);

  useEffect(() => {
    if (!materialMeasures || !quantity1) return;
    setValue('quantity2', quantity1 * materialMeasures?.factorAreaToPc);
    setValue('quantity3', quantity1 * materialMeasures?.factorAreaToKG);
  }, [materialMeasures, quantity1, setValue]);

  useEffect(() => {
    setValue('salesOrderDelivery', selectedSalesOrder?.salesOrderDelivery || '');
  }, [selectedSalesOrder, setValue]);

  useEffect(() => {
    if (routingId && routingId !== entity?.routingId)
      setValue('routingId', materialMeasures?.routingId ?? undefined);
  }, [JSON.stringify(materialMeasures), setValue]);

  useEffect(() => {
    if (!foreseenDelivery) setValue('foreseenDelivery', undefined);
    if (!finalDelivery) setValue('finalDelivery', undefined);
    if (!foreseenDeliveryPOOrigin) setValue('foreseenDeliveryPOOrigin', undefined);
    if (!salesOrderDelivery) setValue('salesOrderDelivery', undefined);
  }, [finalDelivery, foreseenDelivery, foreseenDeliveryPOOrigin, salesOrderDelivery, setValue]);

  useEffect(() => {
    setValue('materialId', materialId);
  }, [materialId, setValue]);

  useEffect(() => {
    setValue('pO_RoutingOperationAddAndUpdateDtos', routingAddAndUpdateOperations, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [routingAddAndUpdateOperations, setValue]);

  useEffect(() => {
    if (routingId && (routingId !== entity?.routingId || discardOperations)) {
      dispatch(getRouting(routingId));
    }
  }, [dispatch, entity?.routingId, routingId]);

  useEffect(() => {
    if (salesOrderSequence) {
      const [soID, soMid] = salesOrderSequence?.split('-');
      setValue('salesOrderId', Number(soID));
      setValue('salesOrderMaterialId', Number(soMid));
    }
  }, [salesOrderSequence]);

  const mapRoutingOperations = (arr: RoutingRoute[]): RoutingRouteFormData[] => {
    return (
      arr.map(({ operation, leadTime, sequence, ...rest }, i) => ({
        ...rest,
        operationName: operation?.name,
        departmentName: operation?.department?.name ?? '',
        id: 0,
        sequence: sequence,
        workCenterId: undefined,
        planningDate: undefined,
        executedDate: undefined,
        operationTime: operation.operationTime ?? undefined,
        leadTime,
      })) ?? []
    );
  };

  useEffect(() => {
    if (
      routingId &&
      (routingId !== entity?.routingId || discardOperations) &&
      selectedRouting?.routingOperations?.length
    ) {
      debugger;
      setValue(
        'routingAddAndUpdateOperations',
        mapRoutingOperations(selectedRouting?.routingOperations),
      );
    }
  }, [entity?.routingId, routingId, selectedRouting, setValue]);

  const handleRoutingChange = (newValue: any, option: any, id: 'routingId' | 'materialId') => {
    if (
      routingAddAndUpdateOperations &&
      ((id === 'routingId' && newValue !== entity?.routingId) ||
        (id === 'materialId' && newValue !== entity?.materialDto?.id)) &&
      !discardOperations
    ) {
      // will trigger on first change
      setDiscardOperationModalVisible(true);
      setPendingValue({ value: newValue, id });
    } else {
      setValue(id, newValue);
    }
  };

  const handleDiscardOK = () => {
    pendingValue?.id && pendingValue?.value
      ? setValue(pendingValue?.id, pendingValue?.value, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        })
      : null;
    setDiscardOperationModalVisible(false);
    updateDiscardOperations(true);
  };

  const handleDiscardCancel = () => {
    setPendingValue({ id: undefined, value: undefined });
    setDiscardOperationModalVisible(false);
  };
  return (
    <div className='production-order-container'>
      <div className='form-container'>
        <form
          className='productionOrder-form'
          data-testid='productionOrder-form'
          autoComplete='off'
          onSubmit={(e): void => e.preventDefault()}
        >
          <div className='top'>
            <div className='form-header'>
              <div className='id-container'>
                <CustomInput
                  type='readonly'
                  label={translate('orderNumber')}
                  name={nameof('orderNumber')}
                />
                <CustomInput
                  type='readonly'
                  label={translate('creationDate')}
                  name={nameof('creationDate')}
                />
              </div>
              <div className='header-right'>
                <CustomInput
                  type='select'
                  isRequired={true}
                  label={translate('productionOrderTypeId')}
                  name={nameof('productionOrderTypeId')}
                  options={orderTypeOptions}
                  readOnly={isPlanned}
                  disabled={isPlanned}
                />

                <CustomInput
                  type='select'
                  isRequired={true}
                  label={translate('situationEnum')}
                  name={nameof('situationEnum')}
                  options={translateMapper(situationDropdownOptions as DefaultOptionType[])}
                  isAutocomplete={true}
                  readOnly={!isEditing || isPlanned}
                  disabled={!isEditing || isPlanned}
                />
                <CustomInput
                  type='select'
                  isRequired={true}
                  label={translate('statusOfPlanningEnum')}
                  name={nameof('statusOfPlanningEnum')}
                  options={translateMapper(statusDropdownOptions as DefaultOptionType[])}
                  isAutocomplete={true}
                  readOnly={true}
                  disabled={true}
                />
              </div>
            </div>
            <div className='customer-section'>
              <div className='customer'>
                <CustomInput
                  type='select'
                  isRequired={true}
                  label={translate('customerId')}
                  name={nameof('customerId')}
                  options={customerOptions}
                  isAutocomplete={true}
                  readOnly={isPlanned}
                  disabled={isPlanned}
                />
                <CustomInput
                  type='text'
                  label={translate('customerOrderNumber')}
                  name={nameof('customerOrderNumber')}
                  readOnly={isPlanned}
                  disabled={isPlanned}
                />
              </div>

              <div className='sales-order'>
                <CustomInput
                  type='select'
                  label={translate('salesOrderSequence')}
                  name={nameof('salesOrderSequence')}
                  options={salesOrderSequenceOptions}
                  isAutocomplete={true}
                  readOnly={isPlanned}
                  disabled={isPlanned}
                />
                <CustomInput
                  type='date'
                  label={translate('salesOrderDelivery')}
                  name={nameof('salesOrderDelivery')}
                  readOnly
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className='middle'>
            <div className='material-section'>
              <CustomInput
                key={isEditing ? new Date().getTime() : useId()} //uniqueId to force re-render on change of discardOperations state
                type='select'
                isRequired={true}
                label={translate('materialId')}
                name={nameof('materialId')}
                options={materialOptions}
                isAutocomplete={true}
                handleSelectionChange={
                  isEditing && !discardOperations
                    ? (value, option) => handleRoutingChange(value, option, 'materialId')
                    : undefined
                }
                readOnly={isPlanned}
                disabled={isPlanned}
              />
              <CustomInput
                type='text'
                label={translate('quantity1')}
                name={nameof('quantity1')}
                isRequired={true}
                readOnly={isPlanned}
                disabled={isPlanned}
              />
              <CustomInput
                type='select'
                label={translate('unitOfMeasure1')}
                name={nameof('unitOfMeasure1Id')}
                readOnly
                disabled={true}
                options={unitOfMeasureOptions}
              />

              <CustomInput
                type='text'
                label={translate('quantity2')}
                name={nameof('quantity2')}
                readOnly
                disabled={true}
              />
              <CustomInput
                type='select'
                label={translate('unitOfMeasure2')}
                name={nameof('unitOfMeasure2Id')}
                readOnly
                disabled={true}
                options={unitOfMeasureOptions}
              />
              <CustomInput
                type='text'
                label={translate('quantity3')}
                name={nameof('quantity3')}
                readOnly
              />
              <CustomInput
                type='select'
                label={translate('unitOfMeasure3')}
                name={nameof('unitOfMeasure3Id')}
                readOnly
                disabled={true}
                options={unitOfMeasureOptions}
              />

              <div className='details'>{translate('material_details')}</div>

              <CustomInput
                type='select'
                label={translate('materialGroupId')}
                name={nameof('materialGroupId')}
                readOnly
                disabled={true}
                options={materialGroupOptions}
              />
              <CustomInput
                type='select'
                label={translate('articleId')}
                name={nameof('articleId')}
                readOnly
                disabled={true}
                options={articleOptions}
              />
              <CustomInput
                type='select'
                label={translate('colorId')}
                name={nameof('colorId')}
                readOnly
                disabled={true}
                options={colorOptions}
              />
              <CustomInput
                type='select'
                label={translate('thicknessId')}
                name={nameof('thicknessId')}
                readOnly
                disabled={true}
                options={thicknessOptions}
              />
              <CustomInput
                type='select'
                label={translate('selectionId')}
                name={nameof('selectionId')}
                readOnly
                disabled={true}
                options={selectionOptions}
              />
            </div>

            <div className='date-section'>
              <CustomInput
                type='date'
                label={translate('initialDate')}
                name={nameof('initialDate')}
                isRequired={true}
                readOnly={initialDateDisabled || isPlanned}
                disabled={initialDateDisabled || isPlanned}
                disableDatesFrom={dayjs().subtract(1, 'day')}
              />
              <CustomInput
                type='select'
                label={translate('origin')}
                name={nameof('origin')}
                options={originPOOptions}
                disabled={isPlanned}
                readOnly={isPlanned}
              />

              <CustomInput
                type='date'
                label={translate('foreseenDeliveryPOOrigin')}
                name={nameof('foreseenDeliveryPOOrigin')}
                readOnly
                disabled={true}
              />
              <CustomInput
                type='date'
                label={translate('foreseenDelivery')}
                name={nameof('foreseenDelivery')}
                readOnly
                disabled={true}
              />

              <CustomInput
                type='date'
                label={translate('finalDelivery')}
                name={nameof('finalDelivery')}
                readOnly
                disabled={true}
              />

              <div className='remark'>
                <CustomInput
                  type='textarea'
                  label={translate('remark')}
                  name={nameof('remark')}
                  width={'full-width'}
                  disabled={isPlanned}
                  readOnly={isPlanned}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <Modal
        title={translate('modal.warning')}
        open={discardOperationModalVisible}
        centered={true}
        onOk={handleDiscardOK}
        onCancel={handleDiscardCancel}
      >
        <div className='confirm-modal-content'>
          <img src={warningIcon} alt={'warning'} />
          <span>{translate('change_routing_selection')}</span>
        </div>
      </Modal>
      <div className='productionOrder-table'>
        <CustomInput
          type='select'
          isRequired={true}
          label={translate('routingId')}
          name={nameof('routingId')}
          width='regular'
          options={routingOptions}
          isAutocomplete={true}
          readOnly={isPlanned}
          disabled={isPlanned}
          handleSelectionChange={
            isEditing && !discardOperations
              ? (value, option) => handleRoutingChange(value, option, 'routingId')
              : undefined
          }
        />
        <FormProvider {...form}>
          <RoutesTable useActions={!isPlanned} />
        </FormProvider>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
