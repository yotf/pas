import { ProductionCalendar } from '../../settings/redux/productionCalendars/interfaces';

export const mockedProductionCalendarData: ProductionCalendar = {
  id: 1,
  changeHistoryDto: { createdBy: 'admin', createdOn: '' },
  finalDate: '2023-01-23T08:00:05.863Z',
  initialDate: '2023-01-23T08:00:05.863Z',
  workCenters: [
    {
      department: {
        code: 'new_code',
        isActive: true,
        id: 10,
        name: 'new_name',
      },
      unitOfMeasure: {
        code: 'codetest1234511',
        isActive: false,
        id: 15,
        name: 'codetrst',
      },
      allocations: [{ id: 1, name: 'Recipe' }],
      departmentId: 10,
      allocationBased: 0,
      isActive: true,
      remark: 'Remark',
      unitOfMeasureId: 15,
      workCenterAddAndUpdateDto: [],
      id: 4,
      name: 'asdf',
      workCenter_Id: 1,
      workCenterInterfaceId: 'interface 1',
      departments: [
        {
          id: 2,
          name: 'dsa',
          code: '321c',
          isActive: true,
        },
      ],
      allocation: {
        id: 1,
        name: 'asds',
      },
      unitOfMeasures: [
        {
          id: 3,
          name: 'asd',
          code: 'codes',
          isActive: true,
        },
      ],
      allowedOperations: [],
      workCapacities: [
        {
          id: 1,
          workCenterId: 4,
          weekDay: '2022-12-13T14:56:52.065Z',
          dayOfWeek: 1,
          start: '2022-12-13T14:56:52.065Z',
          break: 0,
          end: '2022-12-13T14:56:52.065Z',
          minutes: 50,
          efficiency: 100,
          availableMinutes: 30,
          isWorkingDay: true,
          capacity: 120,
          changeHistoryDto: { createdBy: 'admin', createdOn: '2022-12-13T14:56:52.065Z' },
        },
      ],
      operations: [
        {
          department: {
            code: 'new_code',
            isActive: true,
            id: 10,
            name: 'new_name',
          },
          unitOfMeasure: {
            code: 'codetest1234511',
            isActive: false,
            id: 15,
            name: 'codetrst',
          },
          allocationBasedDtos: [],
          departments: [],
          unitOfMeasures: [],
          operation_Id: 1,
          departmentId: 10,
          allocationBased: 0,
          isActive: true,
          remark: 'Just small remark',
          unitOfMeasureId: 15,
          operationTime: 100,
          setupTime: 200,
          waitingTime: 300,
          interfaceCode: 'interfaceCode',
          id: 2,
          name: 'new_operation',
        },
      ],
    },
  ],
};

export const mockedProductionCalendarsData: ProductionCalendar[] = [
  mockedProductionCalendarData,
  { ...mockedProductionCalendarData, id: 2 },
];
