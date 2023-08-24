/**
 * @module CrudThunks
 */

import ApiService from '@/modules/shared/services/api.service';
import { AsyncThunk, AsyncThunkAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChangeHistoryDto } from './change-history.dto';

export const VALIDATION_ERRORS_KEY = 'validationErrors';

export type IdentifiableEntity = {
  id?: number | string;
  name?: string;
  isActive?: boolean;
  changeHistoryDto?: ChangeHistoryDto;
  status?: number | string;
  statusOfPlanningEnum?: number;
};
export type IdType = number | string | undefined;

/**
 *  @template Entity Type of data being fetched
 *  Gets all objects of type Entity and sorts them by date
 * */
const createListThunk = <Entity extends IdentifiableEntity>(
  api: string,
): AsyncThunk<Entity[], IdType, Record<string, unknown>> =>
  createAsyncThunk(api, async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<Entity[]>(api);
      const { data } = response;
      const getDate = (a: IdentifiableEntity): number =>
        new Date(a.changeHistoryDto?.updatedOn || a.changeHistoryDto?.createdOn || '').getTime();
      data.sort((a, b) => getDate(b) - getDate(a));
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  });
/**
 *  @template Entity Type of data being read
 *  Gets one object of type Entity by given id
 * */
const createReadThunk = <Entity>(
  api: string,
): AsyncThunk<Entity, IdType, Record<string, unknown>> =>
  createAsyncThunk(api + '/:id', async (id: IdType, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<Entity>(`${api}/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  });
/**
 *  @template Entity Type of data being created/updated
 *  Creates or updates one object of type Entity by given id (if id is 0, a post method is performed)
 * */
const createUpsertThunk = <Entity, PostData extends IdentifiableEntity, SingleEntity>(
  api: string,
  getAllThunk: AsyncThunk<Entity[], IdType, Record<string, unknown>>,
  readThunk: AsyncThunk<SingleEntity, IdType, Record<string, unknown>>,
  shouldRead: boolean,
  getByUpdated: boolean,
  productionOrderUpsert: boolean,
): AsyncThunk<PostData, PostData, Record<string, unknown>> =>
  createAsyncThunk(api + '/upsert', async (payload: PostData, { rejectWithValue, dispatch }) => {
    const id = window.location.href.split('/').pop();
    try {
      const api_id = payload.id as string;
      payload.id =
        payload.id && payload.id?.toString().includes(',')
          ? payload.id.toString().split(',')[0]
          : payload.id;

      const response = payload.id
        ? await ApiService.put<PostData>(api, payload.id, payload)
        : await ApiService.post<PostData>(api, payload);
      dispatch((getByUpdated ? readThunk(id) : getAllThunk()) as AsyncThunkAction<any, any, any>);
      if (!getByUpdated && shouldRead) dispatch(readThunk(id));
      return payload.id ? payload : response.data;
    } catch (err: any) {
      const errors: { description: string }[] = err?.response?.data ?? [];
      if (errors.length) {
        return rejectWithValue({ type: VALIDATION_ERRORS_KEY, errors });
      }
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  });
/**
 *  @template Entity Type of data being deleted
 *  Deletes one object of type Entity by given id
 * */
const createDeleteThunk = (api: string): AsyncThunk<IdType, IdType, Record<string, unknown>> =>
  createAsyncThunk(api + '/delete', async (payload: IdType, { rejectWithValue }) => {
    try {
      if (payload) {
        await ApiService.delete(api, payload);
      }
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response : err.message);
    }
  });

export type CrudThunks<Entity, SingleEntity, PostData> = {
  listThunk: AsyncThunk<Entity[], IdType, Record<string, unknown>>;
  readThunk: AsyncThunk<SingleEntity, IdType, Record<string, unknown>>;
  upsertThunk: AsyncThunk<PostData, PostData, Record<string, unknown>>;
  deleteThunk: AsyncThunk<IdType, IdType, Record<string, unknown>>;
};
/**
 * @template Entity Type of entity in the array of entities recieved from the API
 * @template SingleEntity One entity recieved from the API (by id)
 * @template PostData Type of data being sent to the API
 * @param api URL being targeted by the API call
 * @param shouldRead Used for upsert thunk. Defines if a read thunk needs to be used again after upsert thunk
 * @param getByUpdated Used for upsert thunk. Defines if a list thunk needs to be used again after upsert thunk
 * @param productionOrderUpsert Used for upsert thunk. Production orders are created as a list of production orders, not as one entity so if this condition is true
 * request sent to the backend will use a list
 * @returns CRUD thunks used in {@link CrudSlice | generic slices}
 */
export const createCrudThunks = <
  Entity extends IdentifiableEntity,
  SingleEntity,
  PostData extends IdentifiableEntity,
>(
  api: string,
  shouldRead = false,
  getByUpdated = false,
  productionOrderUpsert = false,
): CrudThunks<Entity, SingleEntity, PostData> => {
  const listThunk = createListThunk<Entity>(api);
  const readThunk = createReadThunk<SingleEntity>(api);
  const upsertThunk = createUpsertThunk<Entity, PostData, SingleEntity>(
    api,
    listThunk,
    readThunk,
    shouldRead,
    getByUpdated,
    productionOrderUpsert,
  );
  const deleteThunk = createDeleteThunk(api);
  return {
    listThunk,
    readThunk,
    upsertThunk,
    deleteThunk,
  };
};
