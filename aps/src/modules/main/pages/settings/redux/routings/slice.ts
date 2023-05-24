/**@module RoutingsSlice */
import {
  RoutingFormData,
  RoutingResponse,
} from '@/modules/main/pages/settings/redux/routings/interfaces';
import { createEntitySlice } from '../slice';
import { Routing } from './interfaces';
import { routingThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const routingsSlice = createEntitySlice<Routing, RoutingResponse, RoutingFormData>(
  'routingsSlice',
  (entity) => [entity.name, entity.material?.name, entity.customer?.name],
  routingThunks,
);
export const { filterEntities: filterRoutings, clearEntity: clearRouting } = routingsSlice.actions;
export const routingsReducer = routingsSlice.reducer;
