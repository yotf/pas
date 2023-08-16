// export interface ColumnsConfigFormData {
// columns: ColumnVisible[];
// }

export interface ColumnVisible {
overviewColumnEnum:number ;
isVisible: boolean;
}

export interface OverviewColumnsForm {
  id: boolean;
  orderNumber: boolean;
  orderType: boolean;
  customerName: boolean;
  salesOrderNumber: boolean;
  materialName: boolean;
  articleName: boolean;
  colorName: boolean;
  operationName: boolean;
  operationId: boolean;
  foreseenDeliveryDate: boolean;
  estimatedTime: boolean;
  setupTime: boolean;
  quantity1: boolean;
  unitOfMeasure1: boolean;
  salesOrderDeliveryDate: boolean;
  PODelivery: boolean;
  POPosition: boolean;
  calendarName: boolean;
  guid?: boolean;
  operationTime: boolean;
  isDelayed?: boolean;
  planningDate: boolean;
  executedDate?: boolean;
}
