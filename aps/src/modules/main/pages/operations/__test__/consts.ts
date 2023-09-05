import { UseFormReturn } from 'react-hook-form';
import {
  Operation,
  OperationMapped,
  OperationsResponse,
} from '../../settings/redux/operations/interfaces';

export const mockForm = (): UseFormReturn<any, any> => {
  const form = {
    clearErrors: () => {
      form.formState.errors = {};
    },
    setError: (field: string, value: string) => {
      form.formState.errors[field] = value;
    },
    watch: () => ({ name: '' }),
    formState: {
      errors: {},
    },
  } as any;
  return form;
};
export const mockedOperation: Operation = {
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
  operation_Id: 11,
  departmentId: 10,
  allocationBased: 1,
  isActive: true,
  remark: 'Remark',
  unitOfMeasureId: 15,
  operationTime: 0.125,
  setupTime: 0.125,
  waitingTime: 0.125,
  interfaceCode: 'INTERFACE_CODE',
  id: 4,
  name: 'asdf',
  usedInPlanning: false,
  usedInWorkCenter: true,
};

export const mockedOperationsData: Operation[] = [
  mockedOperation,
  { ...mockedOperation, id: 2, name: 'new_operation' },
];

export const mockedOperationsResponse: OperationsResponse = {
  data: mockedOperationsData,
  filtered: mockedOperationsData,
  loading: false,
  error: undefined,
};
export const mockedOperationsMappedData: OperationMapped[] = mockedOperationsData.map(
  (obj): OperationMapped => ({
    isActive: obj.isActive,
    id: obj.id,
    interfaceCode: obj.interfaceCode,
    name: obj.name,
    operation_Id: obj.operation_Id,
    operationTime: obj.operationTime,
    setupTime: obj.setupTime,
    departmentName: obj.department?.name,
  }),
);
