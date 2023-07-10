/**
 * @module SharedInterfaces
 */

import { DefaultOptionType } from 'antd/lib/select';
/** Default date format used for datepickers */
export const euDateFormat = 'DD.MM.YYYY';
/** Default time format used for timepickers */
export const timeFormat = 'HH:mm';
/** Status enum used in {@link SalesOrdersPage} */
export enum Status {
  'open' = 1,
  'closed' = 2,
  'canceled' = 3,
}
/** Based on Status enum. Returns dropdown options for selects and radio inputs */
export const statusOptions: DefaultOptionType[] = [
  { label: Status[1], value: 1 },
  { label: Status[2], value: 2 },
  { label: Status[3], value: 3 },
];
/** Status of planning enum, used in {@link ProductionOrderPage} */
export enum PlanningStatus {
  'all' = 1,
  'planned' = 2,
  'document' = 3,
}

export enum AllocationBasedEnum  {
  "quantity1" = 1,
    "formula" = 2,
}
/** Situation enum used in {@link ProductionOrderMaintain} */
export enum POSituation {
  'open' = 1,
  'closed' = 3,
  'cancel' = 2,
}
/** Status enum used in {@link ProductionOrderMaintain}  */
export enum POFormStatus {
  'planned' = 2,
  'document' = 1,
}

export enum PORoutingOperationStatus {
  "notPlanned" = 1,
  "schedule" = 2,
  "cancel" = 3,
  "executed" = 4,
}
/** Dropdown options made from POFormStatus enum */
export const statusDropdownOptions: DefaultOptionType[] = [
  { label: POFormStatus[1], value: 1 },
  { label: POFormStatus[2], value: 2 },


];
/** Dropdown options made from POSituation enum */
export const situationDropdownOptions: DefaultOptionType[] = [
  { label: POSituation[1], value: 1 },
  { label: POSituation[2], value: 2 },
  { label: POSituation[3], value: 3 },
];
/**Placeholder used in modals */
export const zeroPlaceholder = '0';
/**Placeholder used in modals to show time */
export const zeroHourPlaceholder = '00:00';
/** Type of select input. Used to indicate if multiple choices are allowed */
export type SelectInputType = 'multiple' | 'tags' | undefined;
/** Radio options made from PlanningStatus enum */
export const POStatusOptions: DefaultOptionType[] = [
  { label: PlanningStatus[1], value: 1 },
  { label: PlanningStatus[2], value: 2 },
  { label: PlanningStatus[3], value: 3 },
];
