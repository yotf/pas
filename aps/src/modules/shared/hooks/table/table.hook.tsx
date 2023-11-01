/**
 * @module TableHook
 */

import { ExportToExcelContext } from '@/modules/main/components/maintain/contexts/exportToExcel.context';
import { setPagination } from '@/modules/main/pages/settings/redux/sharedTableState/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  CodeSandboxOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Empty, PaginationProps, Space } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import Table, { ColumnsType } from 'antd/lib/table';
import Tooltip from 'antd/lib/tooltip';
import dayjs from 'dayjs';
import { ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslate } from '../translate.hook';
import { createColumns } from './table.columns';
import './table.scss';
import { MaintainContext } from '@/modules/main/components/maintain/contexts/maintain.context';

import { SalesMaterialFormData } from '@/modules/main/pages/settings/redux/salesOrders/interfaces';
import { POFormStatus } from '../../consts';
import { ProductionOrder } from '@/modules/main/pages/settings/redux/productionOrders/interfaces';
/**
 * @template T Type of objects to be rendered in the table. Each object represents one table row.
 */

export type UseTableProps<T> = {
  /** Data to be rendered in the table. Each object in the array is one table row */
  dataSource: T[];
  /** Order of columns in the table header. If columns order is not provided order of key of object (type T) will be used for order of columns */
  columnsOrder?: (keyof T)[];
  /** Localization function used for table header */
  translateHeader: (value: string) => string;
  /** Function used for editing a table row. Has access to all properties of the data represented in the row. */
  onEdit?: (value: T) => void;
  /** Function used for deleting a table row. Has access to all properties of the data represented in the row. */
  onDelete?: (value: T) => void;
  /** Function used for opening production order modal ({@link useProductionOrderModal}). Has access to all properties of the data represented in the row. */
  openProductionModal?: (value: T) => void;
  /** Table columns that need to be rendered differently. Usually used for date formatting or extra styling */
  customColumns?: Partial<Record<keyof T, (value: any, record: T, index: number) => ReactNode>>;
  /** Condition that disables delete button in the table action column. (e.g. If status of production order is planned it cannot be deleted) */
  disableDeleteButtonCondition?: (obj: T) => boolean | undefined;
  /** If false pagination won't be rendered. Default behaviour is true */
  usePaging?: boolean;
  /** Table height in px */
  height?: number;
  /** Unique identifier used for table rows. Usually its id of the object type T. */
  rowKey?: string;
  /** If false action column won't be rendered. By default its true */
  useActions?: boolean;
  /** if false delete button in action column won't be rendered. */
  renderDeleteButton?: boolean;
  /** Adds additional actions in action column. Default actions are edit and delete */
  extraAction?: boolean;
  /** Renders a different icon for edit if true. Used on {@link ProductionCalendarsChecking} page*/
  hasViewOnlyElements?: boolean;
  /** Disables sort on columns provided in the array. If true, all columns will have sort disabled */
  preventSort?: (keyof T)[] | boolean;
  /** Enables rows of the table to be selectable via checkboxes. Used in {@link ProductionOrderPage} */
  rowSelection?: object;
  /** Renders custom columns in place of default ones provided by the {@link TableColumns} function */
  columns?: ColumnsType<T>;

  /**Specifies number of rows per table page */
  pageSize?: number;

  handleRowDoubleClick?: (
    record: any,
    index: number | undefined,
    event: React.MouseEvent<HTMLElement>,
  ) => void;

  isPlannedPO?: boolean;
};
/**
 *
 * @returns A customizable table component based on props provided. Uses {@link TableColumns} to generate default columns.
 */
export const useTable = <T extends object>({
  rowKey = 'id',
  dataSource,
  columnsOrder,
  translateHeader,
  onEdit,
  onDelete,
  openProductionModal,
  columns,
  customColumns,
  disableDeleteButtonCondition,
  usePaging = true,
  height,
  useActions = true,
  renderDeleteButton = true,
  hasViewOnlyElements = false,
  preventSort,
  rowSelection,
  pageSize,
  handleRowDoubleClick,
  isPlannedPO,
}: UseTableProps<T>): JSX.Element => {
  const { setUiData, setSort } = useContext(ExportToExcelContext);
  const {
    ns,
    state: { entity },
    copying,
    isProductionCalendarCheckingPage,
  } = useContext(MaintainContext);

  useEffect(() => {
    if (!isProductionCalendarCheckingPage) setUiData(dataSource);
  }, [JSON.stringify(dataSource), isProductionCalendarCheckingPage]);
  const { translate } = useTranslate({
    ns: 'table',
  });

  // const isPlannedProductionOrder = useMemo(
  //   () =>
  //     ns === 'productionOrder' &&
  //     !!entity?.id &&
  //     //     (entity?.statusOfPlanningEnum === POFormStatus.planned &&
  //     (entity as unknown as ProductionOrder)?.statusOfPlanningEnum === POFormStatus.planned,
  //   [(entity?.id, (entity as unknown as ProductionOrder)?.statusOfPlanningEnum)],
  // );

  const doEdit = useCallback((value: T) => () => onEdit?.(value), [onEdit]);
  const doDelete = useCallback((value: T) => () => onDelete?.(value), [onDelete]);

  const doProductionModal = useCallback(
    (value: T) => () => openProductionModal?.(value),
    [openProductionModal],
  );
  const { pageNumber } = useAppSelector((state) => state.tableState);
  const dispatch = useAppDispatch();

  const onPaginationChange: PaginationProps['onChange'] = (page: number) => {
    dispatch(setPagination(page));
  };

  useEffect(() => {
    return () => {
      dispatch(setPagination(1));
    };
  }, [dispatch]);

  columns =
    columns || createColumns(dataSource, translateHeader, columnsOrder, customColumns, preventSort);
  if (useActions)
    columns.push({
      title: translate('action'),
      key: 'action',
      width: 100,
      render: (value: T & { date: string }, record: T) => {
        const isDisabled = disableDeleteButtonCondition?.(record);

        return (
          <Space size='middle' className='action-container'>
            {!!entity?.id &&
            openProductionModal &&
            !copying &&
            (value as unknown as SalesMaterialFormData)?.id !== 0 ? (
              <Tooltip title={translate('production_order_tooltip')}>
                <CodeSandboxOutlined onClick={doProductionModal(value)} />
              </Tooltip>
            ) : (
              <div className='empty-action'></div>
            )}
            {hasViewOnlyElements &&
            (dayjs(value.date).isBefore(dayjs(), 'day') ||
              dayjs(value.date).isSame(dayjs(), 'day')) ? (
              <EyeOutlined onClick={doEdit(value)} />
            ) : (
              <EditOutlined onClick={doEdit(value)} />
            )}
            {renderDeleteButton && (
              <DeleteOutlined
                {...(isDisabled ? { className: 'disable-button' } : { onClick: doDelete(value) })}
              />
            )}
          </Space>
        );
      },
    });
  else if (isPlannedPO)
    columns.push({
      title: translate('action'),
      key: 'action',
      width: 100,
      render: (value: T & { date: string }, record: T) => (
        <Space size='middle' className='action-container'>
          <CheckCircleOutlined style={{ color: 'black' }} onClick={doEdit(value)} />
        </Space>
      ),
    });

  const table =
    dataSource?.length && dataSource[0] ? (
      <div className='table-wrapper'>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          scroll={{ x: 'fit-content', y: height }}
          onRow={
            handleRowDoubleClick
              ? (record, index) => ({
                  onDoubleClick: (event: React.MouseEvent<HTMLElement>) =>
                    handleRowDoubleClick(record, index, event),
                })
              : undefined
          }
          pagination={
            usePaging && {
              current: pageNumber,
              onChange: onPaginationChange,
              pageSize: pageSize,
            }
          }
          {...(rowSelection && {
            rowSelection: rowSelection,
          })}
          onChange={(_pagination, _filters, sorter): void => {
            setSort(sorter as SorterResult<T>);
          }}
        />
      </div>
    ) : (
      <Empty description={translate('empty')} data-testid='empty' />
    );
  return table;
};
