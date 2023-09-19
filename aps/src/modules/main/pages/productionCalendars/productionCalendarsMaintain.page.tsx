/**
 * @module ProductionCalendarsMaintain
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useExportToExcel } from '@/modules/shared/hooks/useExportToExcel';
import { exportToExcelFile, getDataForExcel } from '@/modules/shared/utils/exportToExcel.utils';
import { useAppSelector } from '@/store/hooks';
import { FC, useCallback, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { ExportToExcelProvider } from '../../components/maintain/contexts/exportToExcel.context';
import { MaintainContextProvider } from '../../components/maintain/contexts/maintain.context';
import MaintainHeader from '../../components/maintain/maintain-header';
import { useRedirectModal } from '../operations/hooks/useRedirectModal';
import { productionCalendarThunks } from '../settings/redux/productionCalendars/thunks';
import {
  ProductionCalendarCheckingExportToExcelData,
  ProductionCalendarDayMapped,
  ProductionCalendarPostResponse,
} from '../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { useProductionCalendarForm } from './hooks/useGenerateProductionCalendarForm';
import ProductionCalendarForm from './productionCalendars-form';
import ProductionCalendarsChecking from './productionCalendarsChecking.page';
import './productionCalendarsMaintain.scss';

export interface ProductionCalendarMaintainProps {
  copy?: boolean;
  checking?: boolean;
}

const columnsOrder: (keyof ProductionCalendarDayMapped)[] = [
  'date',
  'start',
  'break',
  'end',
  'minutes',
  'efficiency',
  'availableMinutes',
  'capacity',
  'remark',
];
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The {@link useGenerateProductionCalendarForm} hook is used to create a form and connect it with {@link MaintainContext}.
 * Redux slice, modals and form are passed to {@link MaintainContext.MaintainContextValue} and are to context children inside {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader} and {@link ProductionCalendarsForm } component all wrapped inside a {@link MaintainContext.MaintainContextProvider }
 * If a user wants to edit an existing production calendar he is directed to {@link ProductionCalendarsChecking} page.
 */
const ProductionCalendarMaintain: FC<ProductionCalendarMaintainProps> = ({
  copy,
  checking,
}: ProductionCalendarMaintainProps) => {
  const sliceState = useAppSelector((state) => state.productionCalendars);
  const { loading } = sliceState;
  const form = useProductionCalendarForm({ state: sliceState, copy });
  const {
    formState: { isDirty },
  } = form;
  const ns = 'productionCalendar';
  const { redirectModal, openRedirectModal } = useRedirectModal({
    isDirty,
  });

  const contextValue = useMemo(
    () => ({
      ns,
      crudThunk: productionCalendarThunks,
      state: sliceState,
      openRedirectModal,
      useDifferentChecks: true,
      isProductionCalendarCheckingPage: true,
    }),
    [openRedirectModal, sliceState],
  );

  const { translate } = useTranslate({ ns: ns });

  const {
    contextValue: exportContext,
    uiData,
    sort,
  } = useExportToExcel<ProductionCalendarCheckingExportToExcelData>();

  const exportToExcel = useCallback(() => {
    exportToExcelFile({
      filename:
        translate('title') +
        '_' +
        (
          sliceState.entity as unknown as ProductionCalendarPostResponse[]
        )[0].productionCalendarBaseInfoDto.id.toString(),
      sheets: uiData.map((month) => {
        return {
          aoa_sheet_data: getDataForExcel(
            month[1].map((day) => ({ ...day, date: day.weekDay })),
            columnsOrder,
            translate,
          ),
          sheetname: translate(month[0]),
        };
      }),
    });
  }, [translate, uiData]);

  return (
    <FormProvider {...form}>
      <MaintainContextProvider value={contextValue}>
        <ExportToExcelProvider value={exportContext}>
          <div className='maintain' data-testid='maintain'>
            <MaintainHeader noActions={true} />
            {!loading && !checking && <ProductionCalendarForm />}
            {checking && (
              <ProductionCalendarsChecking
                checking={checking}
                ns={ns}
                exportToExcel={exportToExcel}
                columnsOrder={columnsOrder}
              />
            )}
          </div>
          {redirectModal}
        </ExportToExcelProvider>
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default ProductionCalendarMaintain;
