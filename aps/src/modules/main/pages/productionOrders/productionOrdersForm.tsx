/**
 * @module ProductionOrderForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
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
import { FC, useContext, useEffect, useMemo } from 'react';
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

/**
 * The form reuses {@link RoutesTable} logic. The useEffect hooks are used to modifiy form values which are dependent on one another (for example when material changes so does routing and that changes the routing table operations).
 * The {@link useProductionOrderOptions} hook provides options for select inputs.
 * @returns Production orders Form component with {@link Input | inputs} connected to the form returned by {@link useProductionOrderForm} hook.
 */
const ProductionOrderForm: FC = () => {
  const {
    ns,
    state: { entity },
  } =
    useContext<
      MaintainContextValue<ProductionOrder, ProductionOrderResponse, ProductionOrderFormData>
    >(MaintainContext);
  const { translate } = useTranslate({ ns });
  const { data: materials } = useAppSelector((state) => state.materials);
  const { data: salesOrders } = useAppSelector((state) => state.salesOrders);
  const { entity: selectedRouting } = useAppSelector((state) => state.routings);

  const dispatch = useAppDispatch();

  const nameof = nameofFactory<ProductionOrderFormData>();

  const {
    customerOptions,
    orderTypeOptions,
    materialOptions,
    salesOrderOptions,
    routingOptions,
    unitOfMeasureOptions,
    materialGroupOptions,
    colorOptions,
    articleOptions,
    selectionOptions,
    thicknessOptions,
  } = useProductionOrderOptions();

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
  } = watch();

  const initialDateDisabled = useMemo(() => !!entity?.origin, [entity?.origin]);
  const isEditing = useMemo(() => !!entity?.id, [entity?.id]);
  const isPlanned = useMemo(
    () => !!entity?.id && entity?.statusOfPlanningEnum == POFormStatus.planned,
    [entity?.id, entity?.statusOfPlanningEnum],
  );
  debugger;

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
    setValue('unitOfMeasure3Id', materialMeasures?.unitOfMeasure1?.id || undefined);
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
    setValue('routingId', materialMeasures?.routingId ?? undefined);
  }, [JSON.stringify(materialMeasures), setValue]);

  useEffect(() => {
    if (!foreseenDelivery) setValue('foreseenDelivery', undefined);
    if (!finalDelivery) setValue('finalDelivery', undefined);
    if (!foreseenDeliveryPOOrigin) setValue('foreseenDeliveryPOOrigin', undefined);
    if (!salesOrderDelivery) setValue('salesOrderDelivery', undefined);
  }, [finalDelivery, foreseenDelivery, foreseenDeliveryPOOrigin, salesOrderDelivery, setValue]);

  const initialDate = getValues('initialDate');
  useEffect(() => {
    const maxOperation =
      routingAddAndUpdateOperations && routingAddAndUpdateOperations?.length > 0
        ? routingAddAndUpdateOperations?.reduce(
            (maxOperation: RoutingRouteFormData, currentOperation: RoutingRouteFormData) => {
              if (
                currentOperation?.leadTime &&
                maxOperation?.leadTime &&
                currentOperation?.leadTime > maxOperation?.leadTime
              ) {
                return currentOperation;
              } else {
                return maxOperation;
              }
            },
          )
        : undefined;
    const foreseenDelivery =
      initialDate && maxOperation && maxOperation.leadTime
        ? dayjs(initialDate).add(maxOperation?.leadTime, 'day').format()
        : undefined;
    setValue('foreseenDelivery', foreseenDelivery);
  }, [initialDate, routingAddAndUpdateOperations]);

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
    if (routingId && routingId !== entity?.routingId) dispatch(getRouting(routingId));
  }, [dispatch, entity?.routingId, routingId]);

  const mapRoutingOperations = (arr: RoutingRoute[]): RoutingRouteFormData[] => {
    const initialDateString = getValues('initialDate');

    const initialDate = initialDateString ? dayjs(initialDateString) : undefined;

    return (
      arr.map(({ operation, leadTime, ...rest }, i) => ({
        ...rest,
        operationName: operation?.name,
        departmentName: operation?.department?.name ?? '',
        id: 0,
        sequence: i + 1,
        workCenterId: undefined,
        planningDate:
          initialDate && leadTime ? initialDate.add(leadTime, 'days').format() : undefined,
        executedDate: undefined,
        operationTime: operation.operationTime ?? undefined,
        leadTime,
      })) ?? []
    );
  };

  useEffect(() => {
    const initialDateString = getValues('initialDate');
    const initialDate = initialDateString ? dayjs(initialDateString) : undefined;
    const withPlannedDate = routingAddAndUpdateOperations?.map(({ leadTime, ...rest }) => ({
      ...rest,
      planningDate:
        initialDate && leadTime ? initialDate.add(leadTime, 'days').format() : undefined,
      leadTime,
    }));
    setValue('routingAddAndUpdateOperations', withPlannedDate);
  }, [routingAddAndUpdateOperations?.length]);

  useEffect(() => {
    if (
      routingId &&
      routingId !== entity?.routingId &&
      selectedRouting?.routingOperations?.length
    ) {
      setValue(
        'routingAddAndUpdateOperations',
        mapRoutingOperations(selectedRouting?.routingOperations),
      );
    }
  }, [entity?.routingId, routingId, selectedRouting, setValue]);
  return (
    <div className='production-order-container'>
      <div className='form-container'>
        <form
          className='productionOrder-form'
          data-testid='productionOrder-form'
          autoComplete='off'
          onSubmit={(e): void => e.preventDefault()}
        >
          <div className='id-container'>
            <CustomInput type='readonly' label={translate('id')} name={nameof('id')} />
            <CustomInput
              type='readonly'
              label={translate('creationDate')}
              name={nameof('creationDate')}
            />
          </div>
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('customerId')}
            name={nameof('customerId')}
            options={customerOptions}
            isAutocomplete={true}
          />
          <CustomInput
            type='text'
            label={translate('customerOrderNumber')}
            name={nameof('customerOrderNumber')}
          />
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('salesOrderId')}
            name={nameof('salesOrderId')}
            options={salesOrderOptions}
            isAutocomplete={true}
          />
          <CustomInput
            type='date'
            label={translate('initialDate')}
            name={nameof('initialDate')}
            isRequired={true}
            readOnly={initialDateDisabled}
            disabled={initialDateDisabled}
            disableDatesFrom={dayjs().subtract(1, 'day')}
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
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('situationEnum')}
            name={nameof('situationEnum')}
            options={translateMapper(situationDropdownOptions as DefaultOptionType[])}
            isAutocomplete={true}
            readOnly={!isEditing}
            disabled={!isEditing}
          />
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('productionOrderTypeId')}
            name={nameof('productionOrderTypeId')}
            options={orderTypeOptions}
          />

          <CustomInput type='text' label={translate('origin')} name={nameof('origin')} />
          <CustomInput
            type='date'
            label={translate('salesOrderDelivery')}
            name={nameof('salesOrderDelivery')}
            readOnly
            disabled={true}
          />
          <CustomInput
            type='select'
            isRequired={true}
            label={translate('materialId')}
            name={nameof('materialId')}
            options={materialOptions}
            isAutocomplete={true}
          />
          <CustomInput
            type='text'
            label={translate('quantity1')}
            name={nameof('quantity1')}
            isRequired={true}
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
            type='text'
            label={translate('quantity2')}
            name={nameof('quantity2')}
            readOnly
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
          <CustomInput
            type='date'
            label={translate('finalDelivery')}
            name={nameof('finalDelivery')}
            readOnly
            disabled={true}
          />
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
          <div className='remark'>
            <CustomInput
              type='textarea'
              label={translate('remark')}
              name={nameof('remark')}
              width={'full-width'}
            />
          </div>
        </form>
      </div>
      <div className='productionOrder-table'>
        <CustomInput
          type='select'
          isRequired={true}
          label={translate('routingId')}
          name={nameof('routingId')}
          width='regular'
          options={routingOptions}
          isAutocomplete={true}
        />
        <FormProvider {...form}>
          <RoutesTable useActions={!isPlanned} />
        </FormProvider>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
