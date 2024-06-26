/**
 * @module OverviewTable
 */
import { createColumns } from '@/modules/shared/hooks/table/table.columns';
import '@/modules/shared/hooks/table/table.scss';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BranchesOutlined } from '@ant-design/icons';
import { Empty, Space, Table } from 'antd';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { OverviewProductionOrderOperationMapped } from '../../settings/redux/overview/interfaces';
import { MappedOverviewTable } from '../hooks/useMappedOverviews';
import { useReallocationOfPlanningModal } from '../reallocationOfPlanning/useReallocationOfPlanningModal';
import TableCalendar from './TableCalendar';
import { overviewTableColumns, zeroHourPlaceholder } from '@/modules/shared/consts';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { getOverviewColumns } from '../../settings/redux/columns/thunks';

export type OverviewTableProps = {
  overviewTableData: MappedOverviewTable;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
  refreshOverview: () => void;
};
/**
 * @param overviewTableData Data returned from {@link useMappedOverviews} hook for one work center
 * @returns One overview table with its {@link TableCalendar}. Creates a Reallocation of Planning modal and callback to open it and passes it to each created table.
 */

export const OverviewTable: FC<OverviewTableProps> = ({
  overviewTableData,
  translate,
  refreshOverview,
}: OverviewTableProps): JSX.Element => {
  const overviewColumnsVisibility = useAppSelector((state) => state.columnConfig.data);
  const { workCenterName, tableData, department } = overviewTableData;

  const { data } = useAppSelector((state) => state.overview);
  const refreshOverviewCallback = () => {
    refreshOverview();
  };

  const { openReallocationModal, reallocationModal } =
    useReallocationOfPlanningModal(refreshOverviewCallback);

  const columnsOrder = overviewTableColumns.filter(
    (col, i) => overviewColumnsVisibility?.[i]?.isVisible,
  );

  const customColumns: Partial<
    Record<keyof OverviewProductionOrderOperationMapped, (value: any) => ReactNode>
  > = {
    planningDate: (value: string) => <span>{dateFormatter(value)}</span>,
  };

  const columns = createColumns(tableData, translate, columnsOrder, customColumns, true);

  columns.push({
    title: translate('action'),
    key: 'action',
    width: 100,
    render: (value: OverviewProductionOrderOperationMapped) => {
      return (
        <Space size='middle' className='action-container'>
          <BranchesOutlined onClick={(): void => openReallocationModal(value)} />
        </Space>
      );
    },
  });

  const calendarData = useMemo(() => {
    return data.find((overviewTable) => overviewTable.workCenter.name === workCenterName);
  }, [data, workCenterName]);

  const table = (
    <div className='table-wrapper'>
      <div className='table-header'>
        <h2>
          {/* {translate('work_center_heading')}:*/} {`${workCenterName} (${department.name})`}
        </h2>
      </div>
      <div className='calendar-wrapper'>
        {tableData.length ? (
          <>
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey={'id'}
              pagination={false}
              key={new Date().getTime()}
              onRow={(record, index) => ({
                onDoubleClick: (event: React.MouseEvent<HTMLElement>) =>
                  openReallocationModal(record),
              })}
            />
            <div className={`calendar calendar-open`}>
              <div className='calendar-table'>
                <TableCalendar calendarData={calendarData} />
              </div>
            </div>
          </>
        ) : (
          <div className='empty-table-container'>
            <span> {translate('empty')}</span>
            {/* // <Empty description={translate('empty')} data-testid='empty' /> */}
          </div>
        )}
      </div>
    </div>
  );
  return (
    <>
      {table}
      {reallocationModal}
    </>
  );
};
