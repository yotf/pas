/**
 * @module RoutingsPage
 */

import { CombinedState } from '@reduxjs/toolkit';
import { FC, useCallback, useMemo } from 'react';
import { StoreType } from '../../../../store';
import { dateFormatter } from '../../../shared/utils/utils';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import PageTable from '../../components/table/page-table.component';
import { Routing, RoutingMapped } from '../settings/redux/routings/interfaces';
import { filterRoutings } from '../settings/redux/routings/slice';
import { deleteRoutingThunk, getAllRoutings } from '../settings/redux/routings/thunks';
import './routings-table.scss';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider} which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider}.
 */
const RoutingsTable: FC = () => {
  const { translate } = useTranslate({ ns: 'routings' });
  const columnsOrder: (keyof RoutingMapped)[] = useMemo(
    () => [
      'routing_id',
      'name',
      'routingInterfaceId',
      'createdOn',
      'materialName',
      'customerName',
      'lotStandardQuantity',
      'isActive',
    ],
    [],
  );
  const mapper = useCallback(
    (obj: Routing): RoutingMapped => ({
      id: obj.id,
      name: obj.name,
      isActive: obj.isActive,
      createdOn: dateFormatter(obj.changeHistoryDto.createdOn),
      customerName: obj.customer?.name ?? '',
      lotStandardQuantity: obj.lotStandardQuantity,
      materialName: obj.material?.name ?? '',
      routing_id: obj.routing_Id,
      routingInterfaceId: obj.routingInterfaceId,
    }),
    [],
  );
  const getName = useCallback((obj: RoutingMapped) => obj.name, []);
  const stateSelector = useCallback((state: CombinedState<StoreType>) => state.routings, []);

  const { contextValue, uiData, sort } = useExportToExcel<RoutingMapped>();
  const { loading } = useAppSelector(stateSelector);

  const exportToExcel = useCallback(() => {
    exportToExcelFile({
      filename: translate('title'),
      sheets: [
        {
          aoa_sheet_data: getDataForExcel(uiData, columnsOrder, translate, sort),
          sheetname: translate('title'),
        },
      ],
    });
  }, [columnsOrder, sort, translate, uiData]);

  return (
    <ExportToExcelProvider value={contextValue}>
      {loading  && (
        <div className='spinner-overlay'>
          <div className='loader-container'>
            <span className='loader-20'></span>
          </div>
        </div>
      )}
      <div className={'routings-table'}>
        <PageTable
          ns={'routings'}
          columnsOrder={columnsOrder}
          readThunk={getAllRoutings}
          filterThunk={filterRoutings}
          deleteThunk={deleteRoutingThunk}
          stateSelector={stateSelector}
          mapEntityToUiData={mapper}
          getName={getName}
          exportToExcel={exportToExcel}
          disableExportToExcelButton={!uiData?.length}
        />
      </div>
    </ExportToExcelProvider>
  );
};

export default RoutingsTable;
