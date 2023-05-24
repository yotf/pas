/**
 * @module ApiService
 */

import axios from '@/services/setup/api';
import { AxiosResponse } from 'axios';

export type ApiServiceType = {
  get<Type>(url: string, body?: object): Promise<AxiosResponse<Type, any>>;
  getById<Type>(url: string, id: number | string): Promise<AxiosResponse<Type, any>>;
  put<Type>(url: string, id: number | string, data: any): Promise<AxiosResponse<Type>>;
  post<Type>(url: string, data?: any): Promise<AxiosResponse<Type>>;
  delete<Type>(url: string, id: number | string): Promise<AxiosResponse<Type>>;
};
/**
 * @returns CRUD operations used in the application
 */
const ApiService: ApiServiceType = {
  get<Type>(url: string, body?: object): Promise<AxiosResponse<Type>> {
    return axios.get(url, body);
  },

  getById<Type>(url: string, id: number | string): Promise<AxiosResponse<Type>> {
    return axios.get(url + `/${id}`);
  },

  put<Type>(url: string, id: number | string, data: any): Promise<AxiosResponse<Type>> {
    return axios.put(url + `/${id}`, data);
  },

  post<Type>(url: string, data?: any): Promise<AxiosResponse<Type>> {
    return axios.post(url, data);
  },

  delete<Type>(url: string, id: number | string): Promise<AxiosResponse<Type>> {
    return axios.delete(url + `/${id}`);
  },
};

export default ApiService;
