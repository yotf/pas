/**
 * @module ProductionCalendarsSlice
 */
import { ProductionCalendarDayMapped } from '../productionCalendarsWorkCapacities/interfaces';
import { createEntitySlice } from '../slice';
import { ProductionCalendar, ProductionCalendarResponse } from './interfaces';
import { productionCalendarThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const productionCalendarsSlice = createEntitySlice<
  ProductionCalendar,
  ProductionCalendarResponse,
  ProductionCalendarDayMapped
>('productionCalendarsSlice', (entity) => [entity.workCenter.name,entity.initialDate,entity.finalDate], productionCalendarThunks);
export const {
  filterEntities: filterProductionCalendars,
  clearEntity: clearProductionCalendars,
  clearError: clearProductionCalendarsError,
} = productionCalendarsSlice.actions;
export const productionCalendarsReducer = productionCalendarsSlice.reducer;
