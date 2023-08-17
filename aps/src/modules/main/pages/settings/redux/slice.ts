/**
 * @module CrudSlice
 */

import {
  CaseReducer,
  CombinedState,
  createSlice,
  Draft,
  PayloadAction,
  Slice,
} from '@reduxjs/toolkit';
import { StoreType } from '../../../../../store';
import { CrudThunks, IdentifiableEntity, VALIDATION_ERRORS_KEY } from './thunks';
import { ValidationError } from './validation-error.type';
import { dateFormatter, isValidDateFormat } from '@/modules/shared/utils/utils';

export type StateSelector<Entity, SingleEntity> = (
  state: CombinedState<StoreType>,
) => State<Entity, SingleEntity>;

export interface AxiosErrorFormat {
  config: object;
  data: string;
  headers: object;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export type State<Entity = any, SingleEntity = any> = {
  loading: boolean;
  error?: any;
  data: Entity[];
  filtered: Entity[];
  entity?: SingleEntity;
  validationErrors?: ValidationError[];
};
/**
 * @template Entity Type of entity in the array of entities recieved from the API
 * @template SingleEntity One entity recieved from the API (by id)
 * @template PostData Type of data being sent to the API
 * @param name Name of the slice created
 * @param searchFields Fields included in filtering by inputed search string
 * @param thunks Thunks used in the slice, created by {@link CrudThunks}
 * @returns A reusable slice for getting and managing data of the provided type
 */
export const createEntitySlice = <
  Entity extends IdentifiableEntity,
  SingleEntity extends Entity,
  PostData extends Partial<IdentifiableEntity>,
>(
  name: string,
  searchFields: (entity: Entity) => (string | undefined)[],
  thunks: CrudThunks<Entity, SingleEntity, PostData>,
): Slice<
  State<Entity, SingleEntity>,
  {
    clearEntity: CaseReducer<State<Entity, SingleEntity>>;
    filterEntities: CaseReducer<State<Entity, SingleEntity>, PayloadAction<string>>;
    clearError: CaseReducer<State<Entity, SingleEntity>>;
  }
> =>
  createSlice({
    name,
    initialState: {
      loading: true,
      error: undefined,
      data: [],
      filtered: [],
      entity: undefined,
    } as State<Entity, SingleEntity>,
    reducers: {
      clearEntity: (state) => {
        state.entity = undefined;
      },
      clearError: (state) => {
        state.error = undefined;
      },
      /**
       * Filters by properties of entity provided in searchFields parameter
       */
      filterEntities: (state, action: PayloadAction<string>) => {
        const searchCriteria = action.payload?.toLocaleLowerCase();
        state.filtered = state.data.filter((entity) =>
          searchFields(entity as Entity).some((value) => {
            const valueToSearch = value && isValidDateFormat(value) ? dateFormatter(value) : value;
            return valueToSearch?.toString().toLowerCase().includes(searchCriteria);
          }),
        );
      },
    },
    extraReducers: (builder) => {
      builder.addCase(thunks.listThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.filtered = state.data = action.payload as Draft<Entity[]>;
        state.error = undefined;
      });
      builder.addCase(thunks.listThunk.rejected, (state, action) => {
        state.loading = false;
        state.filtered = state.data = [];
        state.error = action.error.message;
      });
      builder.addCase(thunks.listThunk.pending, (state) => {
        state.loading = true;
        state.validationErrors = undefined;
      });
      builder.addCase(thunks.readThunk.pending, (state) => {
        state.loading = true;
        state.validationErrors = undefined;
      });
      builder.addCase(thunks.readThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload as Draft<SingleEntity>;
        state.error = undefined;
      });
      builder.addCase(thunks.readThunk.rejected, (state, action: any) => {
        state.loading = false;
        // state.filtered = state.data = [];
        state.error = action.error.message;
      });
      builder.addCase(thunks.upsertThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.validationErrors = undefined;
      });
      builder.addCase(thunks.upsertThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = undefined;
      });
      builder.addCase(thunks.upsertThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
        if (action.payload.type === VALIDATION_ERRORS_KEY) {
          state.validationErrors = action.payload.errors as ValidationError[];
        }
      });
      builder.addCase(thunks.deleteThunk.pending, (state) => {
        state.loading = true;
        state.validationErrors = undefined;
      });
      builder.addCase(thunks.deleteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.data = state.data.filter(({ id }) => id !== action.payload);
        state.filtered = state.data;
      });
      builder.addCase(thunks.deleteThunk.rejected, (state, action: any) => {
        debugger;
        state.loading = false;
        // state.error = action.error.message;
        state.error = action.payload;
      });
    },
  });
