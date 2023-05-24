import { mockedSettingsItem } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SalesOrder } from '../../settings/redux/salesOrders/interfaces';

export const mockedSalesOrder: SalesOrder = {
  id: 1,
  orderNumber: 1,
  orderTypeId: 1,
  customerId: 1,
  customerOrderNumber: '123',
  status: 1,
  remark: 'remark',
  salesOrderDelivery: '',
  orderTypes: [mockedSettingsItem],
  orderType: mockedSettingsItem,
  customers: [mockedSettingsItem],
  customer: mockedSettingsItem,
  statuses: [mockedSettingsItem],
  statusInfo: mockedSettingsItem,
  salesOrderMaterials: [],
  changeHistoryDto: { createdBy: 'creator', createdOn: '2022-12-22T18:09:00' },
};

export const mockedSalesOrdersData: SalesOrder[] = [
  mockedSalesOrder,
  { ...mockedSalesOrder, id: 2 },
];
