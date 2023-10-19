/**
 * @module ProductionOrderPage
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import {
  PlanningStatus,
  POFormStatus,
  POSituation,
  POSituationOptions,
  POStatusOptions,
  SituationStatus,
} from '@/modules/shared/consts';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import {
  dateFormatter,
  FormCustomFilter,
  PageTableAdditionalElements,
} from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CombinedState } from '@reduxjs/toolkit';
import { DefaultOptionType } from 'antd/es/select';
import { RefTable } from 'antd/es/table/interface';
import { FC, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StoreType } from '../../../../store';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import PageTable from '../../components/table/page-table.component';
import {
  ProductionOrder,
  ProductionOrderMapped,
} from '../settings/redux/productionOrders/interfaces';
import { StatusUpdateData } from '../settings/redux/productionOrders/productionOrdersStatus/interfaces';
import { updateProductionOrderStatus } from '../settings/redux/productionOrders/productionOrdersStatus/thunks';
import { filterProductionOrders } from '../settings/redux/productionOrders/slice';
import {
  deleteProductionOrder,
  getAllProductionOrders,
} from '../settings/redux/productionOrders/thunks';
import { IdentifiableEntity } from '../settings/redux/thunks';
import './productionOrders.scss';
import {
  notificationFail,
  notificationSuccess,
} from '@/modules/shared/services/notification.service';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * Adds additional filters and checkbox row selection to the table which is specific for this page.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider} which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider}.
 */
const ProductionOrdersTable: FC = () => {
  const columnsOrder: (keyof ProductionOrderMapped)[] = useMemo(
    () => [
      'id',
      'orderNumber',
      'orderType',
      'creationDate',
      'status',
      'customerName',
      'salesOrderSequence',
      'salesOrderType',
      'materialName',
      'articleName',
      'colorName',
      'quantity1',
      'unitOfMeasure1',
      'quantity2',
      'unitOfMeasure2',
      'quantity3',
      'salesOrderDeliveryDate',
      'initialPlanningDate',
      'POFinalDeliveryDate',
      'POPosition',
      'deliveryOfPosition',
      'originPO',
      'situation',
    ],
    [],
  );

  const mapper = useCallback(
    (obj: ProductionOrder): ProductionOrderMapped => ({
      id: obj.id,
      orderNumber: obj.productionOrder_Id ?? '',
      orderType: obj?.productionOrderTypeDto?.name,
      creationDate: dateFormatter(obj.changeHistoryDto.createdOn),
      status: obj.statusOfPlanning?.name,
      customerName: obj.customerDto?.name,
      salesOrderSequence:
        obj.salesOrderDto?.orderNumber.toString() +
        ' - Seq. ' +
        obj.salesOrderMaterialDto?.sequence?.toString(),
      salesOrderNumber: obj.salesOrderDto?.orderNumber,
      salesOrderType: obj.salesOrderDto?.orderType.name,
      materialName: obj.materialDto?.name ?? '',
      articleName: obj.materialDto?.article?.name, //|| obj.salesOrderMaterialDto?.material?.article?.name,
      colorName: obj.materialDto?.color?.name, //|| obj.salesOrderMaterialDto?.material?.color?.name
      quantity1: obj.quantity1,
      unitOfMeasure1: obj.unitOfMeasure1?.name,
      quantity2: obj.quantity2,
      unitOfMeasure2: obj.unitOfMeasure2?.name,
      quantity3: obj.quantity3,
      salesOrderDeliveryDate: dateFormatter(obj.salesOrderDto?.salesOrderDelivery),
      initialPlanningDate: dateFormatter(obj.initialDate),
      POFinalDeliveryDate: dateFormatter(obj.finalDelivery),
      POPosition: obj.poPosition?.toString() || '',
      deliveryOfPosition: obj.positionDelivery ? dateFormatter(obj.positionDelivery) : '',
      originPO: obj.origin,
      situation: translate(POSituation[obj.situationEnum]),
    }),
    [],
  );
  const getName = useCallback((obj: ProductionOrderMapped) => String(obj.orderNumber), []);
  const stateSelector = useCallback(
    (state: CombinedState<StoreType>) => state.productionOrders,
    [],
  );

  const dispatch = useAppDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>();

  const onSelectionChange = useCallback((newSelectedRowKeys?: Key[]): void => {
    setSelectedRowKeys(newSelectedRowKeys || []);
  }, []);

  const anyCheckboxSelected = useMemo(() => {
    return !!selectedRowKeys?.length ? true : false;
  }, [selectedRowKeys]);

  const updateStatuses = (status: number): void => {
    const putData: StatusUpdateData = {
      productionOrders: selectedRowKeys!,
      statusOfPlanningEnum: status - 1,
    };
    dispatch(updateProductionOrderStatus(putData));
    setSituationChangeRequested(true);
  };

  const { loading: loadingStatus, error } = useAppSelector((state) => state.productionOrderStatus);
  const { loading } = useAppSelector((state) => state.productionOrders);

  const [statusValue, setStatusValue] = useState<number>(1);
  const [situationValue, setSituationValue] = useState<number>(0);
  const [situationChangeRequested, setSituationChangeRequested] = useState<boolean>(false);

  useEffect(() => {
    if (!situationChangeRequested || loadingStatus) return;

    const newStatus = POFormStatus[statusValue - 1];
    if (error) {
      notificationFail(error);
    } else {
      notificationSuccess(
        newStatus === 'document' ? translate('unschedule_success') : translate('schedule_success'),
      );
    }
    setSituationChangeRequested(false);
  }, [situationChangeRequested, loadingStatus, error]);

  useEffect(() => {
    onSelectionChange();
  }, [onSelectionChange, statusValue]);

  const additionalSearch = useCallback((form: UseFormReturn<FormCustomFilter, any>) => {
    const { watch } = form;

    watch((value, { name }) => {
      if (name === 'status') {
        setStatusValue(value.status as number);
      }
      if (name === 'situation') {
        setSituationValue(value.situation as number);
      }
    });
  }, []);

  const additionalFilter = useCallback(
    (data: (ProductionOrderMapped & IdentifiableEntity)[]) => {
      // if (statusValue === PlanningStatus.all && situationValue === SituationStatus.all) return data;
      const filteredByStatus = data.filter((entity: ProductionOrderMapped) => {
        return (
          (statusValue === PlanningStatus.all ||
            entity.status?.toString().toLowerCase() === PlanningStatus[statusValue as number]) &&
          (situationValue == SituationStatus.all ||
            entity.situation?.toString().toLowerCase() ===
              SituationStatus[situationValue as number])
        );
      });

      return filteredByStatus;
    },
    [statusValue, situationValue],
  );
  const ns = 'productionOrder';

  const { translate } = useTranslate({ ns: ns });

  const actionButtons = (
    <>
      <CustomButton
        isDisabled={statusValue !== PlanningStatus.document || !anyCheckboxSelected}
        color='blue'
        type='submit'
        onClick={(): void => updateStatuses(statusValue)}
      >
        {translate('plan_PO')}
      </CustomButton>
      <CustomButton
        isDisabled={statusValue !== PlanningStatus.planned || !anyCheckboxSelected}
        color='white'
        type='submit'
        onClick={(): void => updateStatuses(statusValue)}
      >
        {translate('unschedule')}
      </CustomButton>
    </>
  );

  const translatedOptions = useMemo((): DefaultOptionType[] => {
    return POStatusOptions.map((option) => ({
      ...option,
      label: translate(String(option.label)),
    }));
  }, [translate]);

  const situationOptions = useMemo((): DefaultOptionType[] => {
    return POSituationOptions.map((option) => ({
      ...option,
      label: translate(String(option.label)),
    }));
  }, [translate]);

  const additionalElements: PageTableAdditionalElements = {
    filters: [
      {
        options: translatedOptions,
        type: 'radio',
        register: 'status',
      },
      {
        options: situationOptions,
        type: 'select',
        register: 'situation',
        allowClear: false,
      },
    ],
    buttons: actionButtons,
  };

  const state = useAppSelector(stateSelector);

  const rowSelection: Partial<RefTable> = {
    selectedRowKeys,
    onChange: onSelectionChange,
    getCheckboxProps: (record: any) => {
      return {
        disabled:
          statusValue === PlanningStatus.all ||
          (record.originPO &&
            state.data.find((po) => po.id === record.originPO)?.statusOfPlanningEnum !==
              POFormStatus.planned) ||
          (statusValue === PlanningStatus.document &&
            record.situation === translate(POSituation[POSituation.closed])),
      };
    },
  };

  const { contextValue, uiData, sort } = useExportToExcel<ProductionOrderMapped>();

  const exportToExcel = useCallback(() => {
    exportToExcelFile({
      filename: translate('title'),
      sheets: [
        {
          aoa_sheet_data: getDataForExcel(uiData, columnsOrder, translate, sort),
          sheetname: `${translate('title')} - ${translate(PlanningStatus[statusValue])}`,
        },
      ],
    });
  }, [columnsOrder, sort, statusValue, translate, uiData]);

  return (
    <ExportToExcelProvider value={contextValue}>
      {loadingStatus && situationChangeRequested && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}
      {loading && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}
      <PageTable
        ns={ns}
        columnsOrder={columnsOrder}
        readThunk={getAllProductionOrders}
        filterThunk={filterProductionOrders}
        deleteThunk={deleteProductionOrder}
        stateSelector={stateSelector}
        mapEntityToUiData={mapper}
        getName={getName}
        additionalSearch={additionalSearch}
        additionalFilter={additionalFilter}
        additionalElements={additionalElements}
        rowSelection={rowSelection}
        exportToExcel={exportToExcel}
        renderDeleteButton={false}
        disableExportToExcelButton={!uiData?.length}
      />
    </ExportToExcelProvider>
  );
};

export default ProductionOrdersTable;
