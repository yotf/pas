/**@module MockedReallocationData */
import { PORoutingOperations } from '../../settings/redux/productionOrders/interfaces';
import { WorkCenter } from '../../settings/redux/workCenters/interfaces';

export const mockedPOOperation: PORoutingOperations = {
  id: 105,
  operationId: 78,
  workCenterId: 24,
  planning: true,
  leadTime: 120,
  remark: '',
  standardTime: 110,
  setupTime: 100,
  waitingTime: 12,
  planningDate: '2023-01-23T10:10:01.5092903',
  executedDate: '2023-01-23T10:10:01.5092903',
  pO_OperationStatusEnum: 2,
  changeHistoryDto: { createdBy: '', createdOn: '' },
  workCenter: {} as WorkCenter,
  workCenters: [],
  skipped: false,
  operation: {
    id: 1,
    name: 'Operacija 1',
    operation_Id: 1,
    departmentId: 1,
    allocationBased: 1,
    isActive: true,
    remark: '',
    unitOfMeasureId: 1,
    operationTime: 60,
    setupTime: 60,
    waitingTime: 60,
    department: { name: 'spi' },
    unitOfMeasure: { name: 'spi' },
    interfaceCode: 'a',
    departments: [{ name: 'spi' }],
    allocationBasedDtos: [{ name: 'spi', id: 1 }],
    unitOfMeasures: [{ name: 'spi' }],
    usedInPlanning: true,
    usedInWorkCenter: true,
  },
};

export const mockedReallocationOperations = [
  mockedPOOperation,
  { ...mockedPOOperation, id: 104, leadTime: 10, standardTime: 204, setupTime: 320 },
  {
    ...mockedPOOperation,
    id: 103,
    leadTime: 150,
    standardTime: 203,
    setupTime: 130,
    planningDate: '2023-03-26T10:10:01.5092903',
    workCenterId: 22,
  },
  {
    ...mockedPOOperation,
    id: 74,
    leadTime: 120,
    standardTime: 220,
    setupTime: 330,
    workCenterId: 23,
    executedDate: '',
  },
  {
    ...mockedPOOperation,
    id: 102,
    leadTime: 125,
    standardTime: 120,
    setupTime: 530,
    planningDate: '2023-03-25T10:10:01.5092903',
    executedDate: '',
    workCenterId: 24,
  },
];

export const mockedProductionOrder = {
  id: 101,
  finalDelivery: '2023-01-22T10:10:01.5092903',
  statusOfPlanningEnum: 1,
  salesOrderDto: {
    salesOrderDelivery: '2023-01-23T10:10:01.5092903',
  },
  pO_RoutingOperations: mockedReallocationOperations,
};
