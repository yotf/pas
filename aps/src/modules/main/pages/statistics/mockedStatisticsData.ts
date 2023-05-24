/**@module MockedStatisticsData */
import { Material } from '../settings/redux/materials/interfaces';

export const mockedDelayedOrders = [
  {
    sequence: 1,
    salesOrderNumber: 10,
    customer: {
      name: 'Pera',
      code: '123',
      id: 1,
    },
    material: {
      name: 'Wood',
    } as Material,
    quantity: 10,
    foreseenDelivery: '2023-02-28T10:44:44.3378469',
    salesOrderDelivery: '2023-02-25T10:44:44.3378469',
  },
  {
    sequence: 2,
    salesOrderNumber: 11,
    customer: {
      name: 'Zika',
      code: '123',
      id: 2,
    },
    material: {
      name: 'Metal',
    } as Material,
    quantity: 15,
    foreseenDelivery: '2023-02-28T10:44:44.3378469',
    salesOrderDelivery: '2023-02-25T10:44:44.3378469',
  },
  {
    sequence: 3,
    salesOrderNumber: 12,
    customer: {
      name: 'Djole',
      code: '123',
      id: 3,
    },
    material: {
      name: 'Leather',
    } as Material,
    quantity: 20,
    foreseenDelivery: '2023-03-01T10:44:44.3378469',
    salesOrderDelivery: '2023-02-25T10:44:44.3378469',
  },
];
