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
import {
  limitNumberOfChars,
  limitToNumericKeyDown,
  nameofFactory,
} from '@/modules/shared/utils/utils';
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
import { executeProductionOrderOperation } from '../settings/redux/productionOrders/productionOrderExecute/thunks';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
import { getProductionOrder } from '../settings/redux/productionOrders/thunks';
//import { getProductionOrder } from '../settings/redux/productionOrders/thunks';

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
  const { loading, error: executionError } = useAppSelector(
    (state) => state.productionOrderExecution,
  );
  // const { entity: selectedOrigin } = useAppSelector((state) => state.productionOrders);
  // const { data: selectedOrigin } = useAppSelector((state) => state.singleProductionOrder);

  const [executionSubmitted, setExecutionSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!executionSubmitted || loading) return;
    if (executionError) {
      const errorMessage =
        typeof executionError === 'string' ? executionError : translate('execute_fail');
      notificationFail(errorMessage);
    } else {
      notificationSuccess(translate('execute_success'));
      dispatch(getProductionOrder(entity?.id));
    }
    setExecutionSubmitted(false);
  }, [executionError, loading, executionSubmitted, translate]);

  const executeOperationCallback = () => {
    setExecutionSubmitted(true);
  };

  const [discardOperationModalVisible, setDiscardOperationModalVisible] = useState<boolean>(false);
  const [pendingValue, setPendingValue] = useState<pendingFieldType>();
  const dispatch = useAppDispatch();

  const nameof = nameofFactory<ProductionOrderFormData>();
  const form = useFormContext<ProductionOrderFormData>();

  const { watch, setValue, getValues, trigger } = form;

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
    customerId,
  } = watch();

  const {
    customerOptions,
    orderTypeOptions,
    materialOptions,
    routingOptions,

    salesOrderSequenceOptions,
    originPOOptions,
    defaultKg,
  } = useProductionOrderOptions(entity, customerId);

  const initialDateDisabled = useMemo(() => !!entity?.origin, [entity?.origin]);
  const isEditing = useMemo(() => !!entity?.id && !copy, [entity?.id, copy]);
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
    setValue('unitOfMeasure1Id', materialMeasures?.unitOfMeasure1?.id || undefined, {
      shouldDirty: false,
    });
    setValue('unitOfMeasure2Id', materialMeasures?.unitOfMeasure2?.id || undefined, {
      shouldDirty: false,
    });
    setValue('unitOfMeasure3Id', defaultKg?.id || undefined, { shouldDirty: false });
  }, [materialMeasures, setValue]);

  const materialOptionsAll = useMemo(() => {
    return {
      unitOfMeasure1Id: {
        label: materialMeasures?.unitOfMeasure1.name,
        value: materialMeasures?.unitOfMeasure1.id!,
      },
      unitOfMeasure2Id: {
        label: materialMeasures?.unitOfMeasure2.name,
        value: materialMeasures?.unitOfMeasure2.id!,
      },
      materialGroupId: {
        label: materialMeasures?.materialGroup.name,
        value: materialMeasures?.materialGroup.id!,
      },
      articleId: {
        label: materialMeasures?.article.name,
        value: materialMeasures?.article.id!,
      },
      colorId: {
        label: materialMeasures?.color.name,
        value: materialMeasures?.color.id!,
      },
      thicknessId: {
        label: materialMeasures?.thickness.name,
        value: materialMeasures?.thickness.id!,
      },
      selectionId: {
        label: materialMeasures?.selection.name,
        value: materialMeasures?.selection.id!,
      },
    };
  }, [materialMeasures]);

  useEffect(() => {
    setValue('materialGroupId', materialMeasures?.materialGroupId, { shouldDirty: false });
    setValue('articleId', materialMeasures?.articleId, { shouldDirty: false });
    setValue('colorId', materialMeasures?.colorId, { shouldDirty: false });
    setValue('thicknessId', materialMeasures?.thicknessId, { shouldDirty: false });
    setValue('selectionId', materialMeasures?.selectionId, { shouldDirty: false });
  }, [materialMeasures, setValue]);

  useEffect(() => {
    if (!materialMeasures || !quantity1 || quantity1 === entity?.quantity1) return;
    setValue('quantity2', quantity1 * materialMeasures?.factorAreaToPc);
    setValue('quantity3', quantity1 * materialMeasures?.factorAreaToKG);
  }, [quantity1, setValue]);

  useEffect(() => {
    setValue('salesOrderDelivery', selectedSalesOrder?.salesOrderDelivery || '', {
      shouldDirty: false,
    });
  }, [selectedSalesOrder, setValue]);

  useEffect(() => {
    if (materialId != entity?.materialDto?.id) {
      setValue('routingId', materialMeasures?.routingId ?? undefined, { shouldDirty: false });
      trigger('routingId');
    }
  }, [materialId, setValue, isPlanned]);

  useEffect(() => {
    if (!foreseenDelivery) setValue('foreseenDelivery', undefined, { shouldDirty: false });
    if (!finalDelivery) setValue('finalDelivery', undefined, { shouldDirty: false });
    if (!foreseenDeliveryPOOrigin)
      setValue('foreseenDeliveryPOOrigin', undefined, { shouldDirty: false });
    if (!salesOrderDelivery) setValue('salesOrderDelivery', undefined, { shouldDirty: false });
  }, [finalDelivery, foreseenDelivery, foreseenDeliveryPOOrigin, salesOrderDelivery, setValue]);

  // useEffect(() => {
  //   //  if (origin) dispatch(getProductionOrder(origin));
  // }, [origin]);
  // useEffect(() => {
  //   debu;
  //   if (selectedOrigin) setValue('foreseenDeliveryPOOrigin', selectedOrigin.foreseenDelivery);
  // }, [selectedOrigin]);

  useEffect(() => {
    if (!routingAddAndUpdateOperations || routingAddAndUpdateOperations?.length === 0) return;
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

  useEffect(() => {
    if (customerId) setValue('salesOrderSequence', undefined);
  }, [customerId]);

  const mapRoutingOperations = (arr: RoutingRoute[]): RoutingRouteFormData[] => {
    return (
      arr.map(({ operation, leadTime, sequence, skipped, executedDate, ...rest }, i) => ({
        ...rest,
        operationName: operation?.name,
        departmentName: operation?.department?.name ?? '',
        id: 0,
        sequence: sequence,
        workCenterId: undefined,
        planningDate: undefined,
        executedDate: executedDate,
        operationTime: operation.operationTime ?? undefined,
        leadTime,
        skipped: skipped,
      })) ?? []
    );
  };

  useEffect(() => {
    if (
      routingId &&
      (routingId !== entity?.routingId || discardOperations) &&
      selectedRouting?.routingOperations?.length
    ) {
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
          <div className='id-container'>
            {isEditing ? (
              <CustomInput
                type='readonly'
                //   label={translate('orderNumber')}
                name={nameof('orderNumber')}
              />
            ) : (
              <div></div>
            )}
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

          <div className='border'></div>

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
          </div>

          <div className='sales-order'>
            <CustomInput
              type='select'
              label={translate('salesOrderSequence')}
              name={nameof('salesOrderSequence')}
              options={salesOrderSequenceOptions}
              isAutocomplete={true}
              isRequired={true}
              readOnly={isPlanned}
              disabled={isPlanned}
            />
            <CustomInput
              type='text'
              label={translate('customerOrderNumber')}
              name={nameof('customerOrderNumber')}
              readOnly={isPlanned}
              disabled={isPlanned}
              maxLength={50}
            />
            <CustomInput
              type='date'
              label={translate('salesOrderDelivery')}
              name={nameof('salesOrderDelivery')}
              readOnly
              disabled={true}
            />
          </div>
          <div className='border'></div>

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
                (isEditing || copy) && !discardOperations
                  ? (value, option) => handleRoutingChange(value, option, 'materialId')
                  : undefined
              }
              readOnly={isPlanned}
              disabled={isPlanned}
            />
            <CustomInput
              type='tel'
              pattern='[0-9]*'
              label={translate('quantity1')}
              name={nameof('quantity1')}
              isRequired={true}
              readOnly={isPlanned}
              disabled={isPlanned}
              maxLength={5}
              onKeyDownEvent={limitToNumericKeyDown}
            />

            {/* <div className='uom-label'>
            {unitOfMeasureOptions.find((uom) => uom.value === unitOfMeasure1Id)?.label}
          </div> */}
            <div className='uom-label'>{materialOptionsAll.unitOfMeasure1Id.label}</div>

            <CustomInput
              type='text'
              label={translate('quantity2')}
              name={nameof('quantity2')}
              readOnly
              //  disabled={true}
            />

            {/* <div className='uom-label'>
            {unitOfMeasureOptions.find((uom) => uom.value === unitOfMeasure2Id)?.label}
          </div> */}
            <div className='uom-label'>{materialOptionsAll.unitOfMeasure2Id.label}</div>

            <CustomInput
              type='text'
              label={translate('quantity3')}
              name={nameof('quantity3')}
              readOnly
            />
            {/* <div className='uom-label'>
          {unitOfMeasureOptions.find((uom) => uom.value === unitOfMeasure3Id)?.label}
        </div> */}
            <div className='uom-label'>{defaultKg?.name}</div>
            <div className='details'>{translate('material_details')}</div>

            <CustomInput
              type='select'
              label={translate('materialGroupId')}
              name={nameof('materialGroupId')}
              readOnly
              disabled={true}
              // options={materialGroupOptions}
              options={[materialOptionsAll.materialGroupId]}
            />
            <CustomInput
              type='select'
              label={translate('articleId')}
              name={nameof('articleId')}
              readOnly
              disabled={true}
              // options={articleOptions}
              options={[materialOptionsAll.articleId]}
            />
            <CustomInput
              type='select'
              label={translate('colorId')}
              name={nameof('colorId')}
              readOnly
              disabled={true}
              //   options={colorOptions}
              options={[materialOptionsAll.colorId]}
            />
            <CustomInput
              type='select'
              label={translate('thicknessId')}
              name={nameof('thicknessId')}
              readOnly
              disabled={true}
              //options={thicknessOptions}
              options={[materialOptionsAll.thicknessId]}
            />
            <CustomInput
              type='select'
              label={translate('selectionId')}
              name={nameof('selectionId')}
              readOnly
              disabled={true}
              //options={selectionOptions}
              options={[materialOptionsAll.selectionId]}
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
            <div className='label-wider'>
              <CustomInput
                type='date'
                label={translate('foreseenDeliveryPOOrigin')}
                name={nameof('foreseenDeliveryPOOrigin')}
                readOnly
                disabled={true}
              />
            </div>
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
                onKeyDownEvent={(e) => limitNumberOfChars(e, 200)}
              />
            </div>
          </div>
        </form>
      </div>
      <Modal
        //  title={translate('modal.warning')}
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
            (isEditing || copy) && !discardOperations
              ? (value, option) => handleRoutingChange(value, option, 'routingId')
              : undefined
          }
        />
        <FormProvider {...form}>
          <RoutesTable
            useActions={!isPlanned}
            isPlannedPO={isPlanned}
            linkedPOId={entity?.id}
            executeOperationCallback={executeOperationCallback}
          />
        </FormProvider>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
