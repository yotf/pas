/**@module UserInterfaces */
import BaseResponse from '@/modules/shared/services/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { ValidationError } from '../validation-error.type';
import { Position } from './../../consts/interfaces';

export interface User {
  id: string;
  lastLogin?: string;
  position?: Position;
  role?: Role;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  roleId?: string;
  positionId?: number;
  changeHistoryDto: ChangeHistoryDto;
}

export interface UserFormData {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  roleId?: string;
  positionId?: number;
}

export interface UserMapped {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionName?: string;
  roleName?: string;
  isActive: boolean;
}

export interface UsersResponse extends BaseResponse {
  data: User[];
  filtered: User[];
  roles: Role[];
  validationErrors?: ValidationError[];
}

export interface Role {
  id: number;
  name: string;
}
