import { Routing } from './../../settings/redux/routings/interfaces';

export const mockedRouting: Routing = {
  isActive: true,
  remark: 'REMARK',
  interfaceCode: 'INTERFACE_CODE',
  routingInterfaceId: 'ROUTING_INTERFACE_CODE',
  id: 4,
  name: 'asdf',
  routing_Id: 4,

  customerId: 1,
  lotStandardQuantity: 15,

  changeHistoryDto: { createdBy: 'creator', createdOn: '2022-12-22T18:09:00' },
};

export const mockedRoutingsData: Routing[] = [
  mockedRouting,
  { ...mockedRouting, id: 2, name: 'new_operation' },
];
