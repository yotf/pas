/**
 * @module OverviewTable
 */
import { createColumns } from '@/modules/shared/hooks/table/table.columns';
import '@/modules/shared/hooks/table/table.scss';
import { useAppSelector } from '@/store/hooks';
import { BranchesOutlined } from '@ant-design/icons';
import { Empty, Space, Table } from 'antd';
import { FC, useMemo, useState } from 'react';
import { OverviewProductionOrderMapped } from '../../settings/redux/overview/interfaces';
import { MappedOverviewTable } from '../hooks/useMappedOverviews';
import { useReallocationOfPlanningModal } from '../reallocationOfPlanning/useReallocationOfPlanningModal';
import TableCalendar from './TableCalendar';

export type OverviewTableProps = {
  overviewTableData: MappedOverviewTable;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
};
/**
 * @param overviewTableData Data returned from {@link useMappedOverviews} hook for one work center
 * @returns One overview table with its {@link TableCalendar}. Creates a Reallocation of Planning modal and callback to open it and passes it to each created table.
 */
export const OverviewTable: FC<OverviewTableProps> = ({
  overviewTableData,
  translate,
}: OverviewTableProps): JSX.Element => {
  const { workCenterName, tableData } = overviewTableData;

  const { data } = useAppSelector((state) => state.overview);

  const [toggleCalendar, setToggleCalendar] = useState(false);

  const { openReallocationModal, reallocationModal } = useReallocationOfPlanningModal();
  const columns = createColumns(tableData, translate, undefined, undefined, true);
  columns.push({
    title: translate('action'),
    key: 'action',
    width: 100,
    render: (value: OverviewProductionOrderMapped) => {
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
          {translate('work_center_heading')}: {workCenterName}
        </h2>
      </div>
      <div className='calendar-wrapper'>
        {tableData.length ? (
          <>
            <Table columns={columns} dataSource={tableData} rowKey={'id'} pagination={false} />
            <div className={`calendar ${toggleCalendar ? 'calendar-open' : ''}`}>
              <button onClick={(): void => setToggleCalendar(!toggleCalendar)}>
                {toggleCalendar ? '>' : '<'}
              </button>
              <div className='calendar-table'>
                <TableCalendar calendarData={calendarData} />
              </div>
            </div>
          </>
        ) : (
          <div className='empty-table-container'>
            <Empty description={translate('empty')} data-testid='empty' />
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
