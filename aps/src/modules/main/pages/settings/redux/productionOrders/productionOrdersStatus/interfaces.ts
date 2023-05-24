/**@module ProductionOrderStatusInterfaces */
import { Key } from 'react';

export type StatusUpdateData = {
  /** Production orders to have their status changed */
  productionOrders: Key[];
  /** New status of production orders */
  statusOfPlanningEnum: number;
};
