/**
 * @module useMappedOverviews
 */

import {
  OverviewWorkCenter,
  OverviewProductionOrderOperationMapped,
} from '../../settings/redux/overview/interfaces';
import { productionOrderMapper } from '../utils/productionOrderMapper';

export type MappedOverviewTable = {
  workCenterName: string;
  tableData: OverviewProductionOrderOperationMapped[];
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
    mappedTables.push({ workCenterName: data[i].workCenter.name, tableData: mappedTable });
    i++;
  }

  return mappedTables;
};
