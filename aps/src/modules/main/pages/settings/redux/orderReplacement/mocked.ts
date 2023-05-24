/**
 * @module OrderReplacementMockedData
 */

import { OrderReplacementResponse, ProductionOrder, SalesOrderReplacement } from './interfaces';

const setValues = (): ProductionOrder[] => {
  const result: ProductionOrder[] = [];
  for (let i = 0; i < 20; i++) {
    result.push({
      sequence: i + 1,
      foreseenDelivery: `2023-12-${i + 1}T11:42:47.295Z`,
      materialName: `Material ${i}`,
      productionOrderNumber: 112 + i,
      quantity1: 10 * i,
      quantity2: 100 * i,
      unitOfMeasure1: `Unit of measure 1 - ${i}`,
      unitOfMeasure2: `Unit of measure 2 - ${i}`,
    });
  }
  return result;
};

export const mocked: OrderReplacementResponse = {
  data: {
    inProductionOrders: setValues(),
    outProductionOrders: setValues(),
  },
  form: [],
  loading: false,
  error: undefined,
};

export const mockedFormData: SalesOrderReplacement[] = [
  {
    id: 1,
    name: 'Huni',
    salesOrders: [
      {
        id: 1,
        orderNumber: 'SomeOrderNumber1',
      },
      {
        id: 2,
        orderNumber: 'SomeOrderNumber2',
      },
      {
        id: 3,
        orderNumber: 'SomeOrderNumber3',
      },
    ],
  },
  {
    id: 2,
    name: 'ITEngine',
    salesOrders: [
      {
        id: 11,
        orderNumber: 'SomeOrderNumber11',
      },
      {
        id: 21,
        orderNumber: 'SomeOrderNumber21',
      },
      {
        id: 31,
        orderNumber: 'SomeOrderNumber31',
      },
    ],
  },
];
