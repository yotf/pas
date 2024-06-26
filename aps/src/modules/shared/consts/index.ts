/**
 * @module SharedInterfaces
 */

import { OverviewProductionOrderOperationMapped } from '@/modules/main/pages/settings/redux/overview/interfaces';
import { AxiosErrorFormat } from '@/modules/main/pages/settings/redux/slice';
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

export enum AllocationBasedEnum {
  'quantity1' = 1,
  'formula' = 2,
}

type OverviewTableColumns = keyof OverviewProductionOrderOperationMapped;

export const overviewTableColumns: OverviewTableColumns[] = [
  'orderNumber',
  'orderType',
  'customerName',
  'salesOrderNumber',
  'materialName',
  'articleName',
  'colorName',
  'operationName',
  'foreseenDeliveryDate',
  'estimatedTime',
  'setupTime',
  'quantity1',
  'unitOfMeasure1',
  'salesOrderDeliveryDate',
  'PODelivery',
  'POPosition',
  'operationTime',
  'planningDate',
  'executedDate',
];

export interface CustomError {
  message: string;
  response: AxiosErrorFormat;
}

/** Situation enum used in {@link ProductionOrderMaintain} */

export enum SituationStatus {
  'all' = 0,
  'open' = 1,
  'closed' = 3,
  'canceled' = 2,
}
export enum POSituation {
  'open' = 1,
  'closed' = 3,
  'canceled' = 2,
}
/** Status enum used in {@link ProductionOrderMaintain}  */
export enum POFormStatus {
  'planned' = 2,
  'document' = 1,
}

export enum PORoutingOperationStatus {
  'notPlanned' = 1,
  'schedule' = 2,
  'cancel' = 3,
  'executed' = 4,
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

export const POSituationOptions: DefaultOptionType[] = [
  { label: SituationStatus[0], value: 0 },
  { label: SituationStatus[1], value: 1 },
  { label: SituationStatus[2], value: 2 },
  { label: SituationStatus[3], value: 3 },
];
