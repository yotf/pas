import { ROLE_ADMINISTRATOR, ROLE_USER } from '@/modules/shared/consts/roles';
import { ChangeHistoryDto } from '../../change-history.dto';
import { User, UserFormData, UserMapped } from '../interfaces';

export const errorMessage = 'error message';

export const changeHistoryDto: ChangeHistoryDto = {
  createdBy: 'Administrator',
  createdOn: '0001-01-01T00:00:00',
};

export const mockedData: User[] = [
  {
    id: '1',
    email: 'test1@gmail.com',
    firstName: 'name-1',
    lastName: 'name-1',
    position: {
      id: 1,
      name: 'Position-one',
      isActive: true,
    },
    role: {
      id: 1,
      name: ROLE_ADMINISTRATOR,
    },
    isActive: true,
    lastLogin: '01/01/2001',
    phoneNumber: '0987654321',
    positionId: 1,
    roleId: '1',
    userName: 'test1',
    changeHistoryDto: changeHistoryDto,
  },
  {
    id: '2',
    email: 'test2@gmail.com',
    firstName: 'name-2',
    lastName: 'name-2',
    position: {
      id: 1,
      name: 'Position-one',
      isActive: true,
    },
    role: {
      id: 2,
      name: ROLE_USER,
    },
    isActive: true,
    lastLogin: '01/01/2001',
    phoneNumber: '0987654321',
    positionId: 1,
    roleId: '2',
    userName: 'test2',
    changeHistoryDto: changeHistoryDto,
  },
  {
    id: '3',
    email: 'test3@gmail.com',
    firstName: 'name-3',
    lastName: 'name-3',
    position: {
      id: 2,
      name: 'Position-two',
      isActive: true,
    },
    role: {
      id: 2,
      name: ROLE_USER,
    },
    isActive: false,
    lastLogin: '01/01/2001',
    phoneNumber: '0987654321',
    positionId: 21,
    roleId: '2',
    userName: 'test3',
    changeHistoryDto: changeHistoryDto,
  },
];
export const mockedDataPost: any = {
  id: '92ec9c19-3c59-4dbe-a769-1aa9f61d707c',
  lastLogin: '0001-01-01T00:00:00',
  position: null,
  positions: null,
  roles: null,
  role: null,
  firstName: 'test1',
  lastName: 'test1',
  userName: 'test123321',
  password: null,
  email: 'string1@gmail.com',
  phoneNumber: '0',
  isActive: false,
  roleId: null,
  positionId: null,
};

export const upsertFormData: UserFormData = {
  id: '',
  firstName: 'test1',
  lastName: 'test1',
  userName: 'test123321',
  password: 'string789',
  email: 'string1@gmail.com',
  phoneNumber: '0',
  isActive: false,
};
export const mockedDataFilter: UserMapped[] = [
  {
    id: '1',
    email: 'test1@gmail.com',
    firstName: 'name-1',
    lastName: 'name-1',
    positionName: 'Position-one',
    roleName: ROLE_ADMINISTRATOR,
    isActive: true,
  },
  {
    id: '2',
    email: 'test2@gmail.com',
    firstName: 'name-2',
    lastName: 'name-2',
    positionName: 'Position-one',
    roleName: ROLE_USER,
    isActive: true,
  },
  {
    id: '3',
    email: 'test3@gmail.com',
    firstName: 'name-3',
    lastName: 'name-3',
    positionName: 'Position-two',
    roleName: ROLE_USER,
    isActive: false,
  },
];
