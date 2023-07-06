/**
 * @module MaterialsPage
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { CombinedState } from '@reduxjs/toolkit';
import { FC, useCallback, useMemo } from 'react';
import { StoreType } from '../../../../store';
import { dateFormatter } from '../../../shared/utils/utils';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import PageTable from '../../components/table/page-table.component';
import { Material, MaterialMapped } from '../settings/redux/materials/interfaces';
import { filterMaterials } from '../settings/redux/materials/slice';
import { deleteMaterial, getAllMaterials } from '../settings/redux/materials/thunks';
import './tableStyles.scss';
/**
 * Defines columns order, mapper, getName and stateSelector consts which are passed down to the {@link PageTable} component that handles the rendering.
 * The table is wrapped with {@link ExportToExcelContext.ExportToExcelProvider } which allows the exportToExcel function to create excel reports from values returned by {@link useExportToExcel} hook.
 * @returns A {@link PageTable} component wrapped in {@link ExportToExcelContext.ExportToExcelProvider}.
 */
const MaterialsTable: FC = () => {
  const columnsOrder: (keyof MaterialMapped)[] = useMemo(
    () => [
      'id',
      'materialId',
      'name',
      'materialGroupName',
      'interfaceCode',
      'unitOfMeasure1Name',
      'unitOfMeasure2Name',
      'factorAreaToKG',
      'factorAreaToPC',
      'articleName',
      'colorName',
      'thicknessName',
      'sizeRangeName',
      'selectionName',
      'featureName',
      'routingName',
      'isActive',
    ],
    [],
  );
  const mapper = useCallback(
    (obj: Material): MaterialMapped => ({
      id: obj.id,
      materialId: obj.id,
      name: obj.name,
      isActive: obj.isActive,
      articleName: obj.article?.name ?? '',
      colorName: obj.color?.name ?? '',
      factorAreaToKG: obj.factorAreaToKG,
      factorAreaToPC: obj.factorAreaToPc,
      interfaceCode: obj.interfaceCode,
      materialGroupName: obj.materialGroup?.name ?? '',
      routingName: obj.routing?.name ?? '',
      selectionName: obj.selection?.name ?? '',
      sizeRangeName: obj.sizeRange?.name ?? '',
      thicknessName: obj.thickness?.name ?? '',
      unitOfMeasure1Name: obj.unitOfMeasure1?.name ?? '',
      unitOfMeasure2Name: obj.unitOfMeasure2?.name ?? '',
      featureName: obj.features?.name ?? '',
      createdOn: dateFormatter(obj.changeHistoryDto.createdOn),
    }),
    [],
  );
  const getName = useCallback((obj: MaterialMapped) => obj.name, []);
  const stateSelector = useCallback((state: CombinedState<StoreType>) => state.materials, []);

  const { contextValue, uiData, sort } = useExportToExcel<MaterialMapped>();

  const { translate } = useTranslate({ ns: 'materials' });

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
      <div className={'materials-table'}>
        <PageTable
          ns={'materials'}
          columnsOrder={columnsOrder}
          readThunk={getAllMaterials}
          filterThunk={filterMaterials}
          deleteThunk={deleteMaterial}
          stateSelector={stateSelector}
          mapEntityToUiData={mapper}
          getName={getName}
          exportToExcel={exportToExcel}
          disableExportToExcelButton={!uiData?.length}
          pageSize={20}
        />
      </div>
    </ExportToExcelProvider>
  );
};

export default MaterialsTable;
