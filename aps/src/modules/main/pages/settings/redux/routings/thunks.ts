/**@module RoutingsThunks */
import {
  RoutingFormData,
  RoutingResponse,
} from '@/modules/main/pages/settings/redux/routings/interfaces';
import { BASE_ROUTINGS_API } from '../../consts/apiUrl';
import { createCrudThunks } from './../thunks';
import { Routing } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link RoutingsSlice}
 */
export const routingThunks = createCrudThunks<Routing, RoutingResponse, RoutingFormData>(
  BASE_ROUTINGS_API,
);
export const {
  listThunk: getAllRoutings,
  readThunk: getRouting,
  upsertThunk: upsertRoutingThunk,
  deleteThunk: deleteRoutingThunk,
} = routingThunks;
