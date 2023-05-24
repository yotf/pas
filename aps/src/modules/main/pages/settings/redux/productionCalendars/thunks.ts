/**
 * @module ProductionCalendarThunks
 */
import { ProductionCalendarDayMapped } from '../productionCalendarsWorkCapacities/interfaces';
import { createCrudThunks } from '../thunks';
import { BASE_PRODUCTION_CALENDAR_API } from './../../consts/apiUrl';
import { ProductionCalendar, ProductionCalendarResponse } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link ProductionCalendarsSlice}
 */
export const productionCalendarThunks = createCrudThunks<
  ProductionCalendar,
  ProductionCalendarResponse,
  ProductionCalendarDayMapped
>(BASE_PRODUCTION_CALENDAR_API, false, true);
export const {
  listThunk: getAllProductionCalendars,
  readThunk: getProductionCalendar,
  upsertThunk: upsertProductionCalendar,
  deleteThunk: deleteProductionCalendar,
} = productionCalendarThunks;
