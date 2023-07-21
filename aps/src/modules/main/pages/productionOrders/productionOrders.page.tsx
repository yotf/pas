/**
 * @module ProductionOrderPage
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import {
  PlanningStatus,
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
import { useAppDispatch } from '@/store/hooks';
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
      articleName:
        obj.salesOrderMaterialDto?.material?.article?.name || obj.materialDto?.article?.name,
      colorName: obj.salesOrderMaterialDto?.material?.color?.name || obj.materialDto?.color?.name,
      quantity1: obj.quantity1,
      unitOfMeasure1: obj.unitOfMeasure1?.name,
      quantity2: obj.quantity2,
      unitOfMeasure2: obj.unitOfMeasure2?.name,
      quantity3: obj.quantity3,
      salesOrderDeliveryDate: dateFormatter(obj.salesOrderDto?.salesOrderDelivery),
      initialPlanningDate: dateFormatter(obj.initialDate),
      POFinalDeliveryDate: dateFormatter(obj.finalDelivery),
      POPosition: 'Added later',
      deliveryOfPosition: 'Added Later',
      originPO: obj.origin,
      situation: obj.situation?.name ?? '',
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

  const updateStatuses = (status: number): void => {
    const putData: StatusUpdateData = {
      productionOrders: selectedRowKeys!,
      statusOfPlanningEnum: status - 1,
    };

    dispatch(updateProductionOrderStatus(putData));
  };

  const [statusValue, setStatusValue] = useState<number>(1);
  const [situationValue, setSituationValue] = useState<number>(0);

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
        isDisabled={statusValue !== PlanningStatus.document}
        color='blue'
        type='submit'
        onClick={(): void => updateStatuses(statusValue)}
      >
        {translate('plan_PO')}
      </CustomButton>
      <CustomButton
        isDisabled={statusValue !== PlanningStatus.planned}
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
      },
    ],
    buttons: actionButtons,
  };

  const rowSelection: Partial<RefTable> = {
    selectedRowKeys,
    onChange: onSelectionChange,
    getCheckboxProps: (record: any) => ({
      disabled: statusValue === PlanningStatus.all || record.originPO,
    }),
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
