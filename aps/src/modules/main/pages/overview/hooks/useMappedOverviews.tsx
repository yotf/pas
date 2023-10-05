/**
 * @module useMappedOverviews
 */

import { SettingsPageItem } from '../../settings/consts/interfaces';
import {
  OverviewWorkCenter,
  OverviewProductionOrderOperationMapped,
} from '../../settings/redux/overview/interfaces';
import { productionOrderMapper } from '../utils/productionOrderMapper';

export type MappedOverviewTable = {
  workCenterName: string;
  tableData: OverviewProductionOrderOperationMapped[];
  department: SettingsPageItem;
};
/**
 *
 * @param data Overview data from the API
 * @returns Data separated into tables with their headings (work center names). Uses {@link productionOrderMapper} for mapping production order operations of each table.
 */
export const useMappedOverviewTables = (data: OverviewWorkCenter[]): MappedOverviewTable[] => {
  let i = 0;
  const mappedTables: MappedOverviewTable[] = [];

  while (i < data.length) {
    const mappedTable = data[i].pO_RoutingOperations.map(productionOrderMapper);
    mappedTables.push({
      department: data[i].workCenter.department,
      workCenterName: data[i].workCenter.name,
      tableData: mappedTable,
    });
    i++;
  }

  const sortedByDepartment = mappedTables.sort((a, b) => a.department.id! - b.department.id!);
  return sortedByDepartment;
};
