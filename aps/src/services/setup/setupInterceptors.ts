import { LOGIN_API } from '@/modules/auth/consts/apiUrl';
import { resetTokenThunk } from '@/modules/auth/redux/thunks';
import { getJwt } from '@/modules/auth/services/auth.service';
import { NOT_FOUND_PATH } from '@/modules/shared/consts/pageRoutes.const';
import { router } from '@/modules/shared/routes/setRouter';
import { AnyAction, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from './api';

const setup = (
  store: EnhancedStore<any, AnyAction, [ThunkMiddleware<any, AnyAction, undefined>]>,
): void => {
  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = getJwt();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  const { dispatch } = store;

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== LOGIN_API && err.response) {
        if (err.response.status === 404) {
          const location = window.location.pathname;
          const options = !location.includes('not-found')
            ? { state: { from: location } }
            : { state: (router as any).location.state };
          router.navigate(NOT_FOUND_PATH, options);
          return;
        }
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            await dispatch(resetTokenThunk());

            return await axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    },
  );
};

export default setup;
