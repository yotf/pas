/**@module Store */
import { LoginResponse } from '@/modules/auth/redux/interfaces';
import { authReducer } from '@/modules/auth/redux/slices';
import { SettingsPagesResponse } from '@/modules/main/pages/settings/consts/interfaces';
import { AllowedOperationsResponse } from '@/modules/main/pages/settings/redux/allowedOperations/interfaces';
import { allowedOperationsReducer } from '@/modules/main/pages/settings/redux/allowedOperations/slice';
import { articlesReducer } from '@/modules/main/pages/settings/redux/articles/slice';
import { colorsReducer } from '@/modules/main/pages/settings/redux/colors/slice';
import { customersReducer } from '@/modules/main/pages/settings/redux/customers/slice';
import { departmentsReducer } from '@/modules/main/pages/settings/redux/departments/slice';
import { featuresReducer } from '@/modules/main/pages/settings/redux/features/slice';
import { holidaysReducer } from '@/modules/main/pages/settings/redux/holidays/slice';
import { materialGroupsReducer } from '@/modules/main/pages/settings/redux/materialGroups/slice';
import { OperationsResponse } from '@/modules/main/pages/settings/redux/operations/interfaces';
import { operationsReducer } from '@/modules/main/pages/settings/redux/operations/slice';
import { OrderReplacementResponse } from '@/modules/main/pages/settings/redux/orderReplacement/interfaces';
import { orderReplacementReducer } from '@/modules/main/pages/settings/redux/orderReplacement/slices';
import { orderTypesReducer } from '@/modules/main/pages/settings/redux/orderTypes/slice';
import { OverviewResponse } from '@/modules/main/pages/settings/redux/overview/interfaces';
import { overviewReducer } from '@/modules/main/pages/settings/redux/overview/slice';
import { parametersReducer } from '@/modules/main/pages/settings/redux/parameters/slice';
import { positionsReducer } from '@/modules/main/pages/settings/redux/positions/slice';
import { ProductionCalendarsResponse } from '@/modules/main/pages/settings/redux/productionCalendars/interfaces';
import { productionCalendarsReducer } from '@/modules/main/pages/settings/redux/productionCalendars/slices';
import { ProductionCalendarWorkCapacitiesResponse } from '@/modules/main/pages/settings/redux/productionCalendarsWorkCapacities/interfaces';
import { productionCalendarsWorkCapacitesReducer } from '@/modules/main/pages/settings/redux/productionCalendarsWorkCapacities/slice';
import { ProductionOrdersResponse } from '@/modules/main/pages/settings/redux/productionOrders/interfaces';
import { productionOrdersModalReducer } from '@/modules/main/pages/settings/redux/productionOrders/productionOrdersModal/slice';
import { POModalInitialStateResponse } from '@/modules/main/pages/settings/redux/productionOrders/productionOrdersModal/states';
import { productionOrderReducer } from '@/modules/main/pages/settings/redux/productionOrders/slice';
import { productionOrderTypesReducer } from '@/modules/main/pages/settings/redux/productionOrderTypes/slice';
import { RoutingsResponse } from '@/modules/main/pages/settings/redux/routings/interfaces';
import { routingsReducer } from '@/modules/main/pages/settings/redux/routings/slice';
import { reallocationReducer } from '@/modules/main/pages/settings/redux/reallocationOfPlanning/slice';
import {
  SalesOrder,
  SalesOrdersResponse,
} from '@/modules/main/pages/settings/redux/salesOrders/interfaces';
import { salesOrdersReducer } from '@/modules/main/pages/settings/redux/salesOrders/slice';
import { selectionsReducer } from '@/modules/main/pages/settings/redux/selections/slice';
import { sharedTableReducer } from '@/modules/main/pages/settings/redux/sharedTableState/slice';
import { SharedTableStateType } from '@/modules/main/pages/settings/redux/sharedTableState/states';
import { SimulationDataOverview } from '@/modules/main/pages/settings/redux/simulation/interfaces';
import { simulationReducer } from '@/modules/main/pages/settings/redux/simulation/slice';
import { sizeRangesReducer } from '@/modules/main/pages/settings/redux/sizeRanges/slice';
import { StatisticsResponse } from '@/modules/main/pages/settings/redux/statistics/interfaces';
import { statisticsReducer } from '@/modules/main/pages/settings/redux/statistics/slice';
import { thicknessReducer } from '@/modules/main/pages/settings/redux/thickness/slice';
import { unitOfMeasureReducer } from '@/modules/main/pages/settings/redux/unitOfMeasure/slice';
import { UsersResponse } from '@/modules/main/pages/settings/redux/user/interfaces';
import { usersReducer } from '@/modules/main/pages/settings/redux/user/slices';
import { WorkCapacitesResponse } from '@/modules/main/pages/settings/redux/workcenterCapacities/interfaces';
import { workCapacitiesReducer } from '@/modules/main/pages/settings/redux/workcenterCapacities/slice';
import { WorkCentersResponse } from '@/modules/main/pages/settings/redux/workCenters/interfaces';
import { workCentersReducer } from '@/modules/main/pages/settings/redux/workCenters/slice';
import { InitialState } from '@/modules/shared/components/header/redux/interfaces';
import { sideMenuReducer } from '@/modules/shared/components/header/redux/slices';

import {
  AnyAction,
  CombinedState,
  combineReducers,
  configureStore,
  Dispatch,
  EnhancedStore,
  Middleware,
  PreloadedState,
} from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { MaterialsResponse } from './../modules/main/pages/settings/redux/materials/interfaces';
import { materialsReducer } from './../modules/main/pages/settings/redux/materials/slice';
import BaseResponse from '@/modules/shared/services/interfaces';
import { configurationReducer } from '@/modules/main/pages/settings/redux/configuration/slice';
import { ConfigurationResponse } from '@/modules/main/pages/settings/redux/configuration/states';
import { linkedProductionOrderReducer } from '@/modules/main/pages/settings/redux/productionOrders/productionOrdersLinkedOrders/slice';
import { LinkedPOInitialStateResponse } from '@/modules/main/pages/settings/redux/productionOrders/productionOrdersLinkedOrders/states';
import { salesOrdersWithMaterialsReducer } from '@/modules/main/pages/settings/redux/salesOrders/salesOrdersWithMaterials/slice';
import { ProductionOrderNumberInitialStateResponse } from '@/modules/main/pages/settings/redux/productionOrders/productionOrderOrderNumbers/states';
import { productionOrderNumbersReducer } from '@/modules/main/pages/settings/redux/productionOrders/productionOrderOrderNumbers/slice';
import { columnConfigReducer } from '@/modules/main/pages/settings/redux/columns/slice';
import { ColumnConfigResponse } from '@/modules/main/pages/settings/redux/columns/states';
/** Used for logging redux actions and the state changes they cause in the console. Disabled for production builds*/
const middlewares: Middleware<Record<string, never>, any, Dispatch<AnyAction>>[] = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}
/**Combines all slices into one reducer which provides state data to the entire application */
export const rootReducer = combineReducers<StoreType>({
  auth: authReducer,
  sideMenu: sideMenuReducer,
  users: usersReducer,
  unitOfMeasure: unitOfMeasureReducer,
  features: featuresReducer,
  parameters: parametersReducer,
  departments: departmentsReducer,
  colors: colorsReducer,
  orderTypes: orderTypesReducer,
  customers: customersReducer,
  positions: positionsReducer,
  thickness: thicknessReducer,
  selections: selectionsReducer,
  productionOrderTypes: productionOrderTypesReducer,
  sizeRanges: sizeRangesReducer,
  holidays: holidaysReducer,
  materialGroups: materialGroupsReducer,
  articles: articlesReducer,
  tableState: sharedTableReducer,
  operation: operationsReducer,
  workCenter: workCentersReducer,
  routings: routingsReducer,
  materials: materialsReducer,
  salesOrders: salesOrdersReducer,
  salesOrdersWithMaterials: salesOrdersWithMaterialsReducer,
  workCenterCapacities: workCapacitiesReducer,
  allowedOperations: allowedOperationsReducer,
  productionCalendars: productionCalendarsReducer,
  productionCalendarsWorkCapacities: productionCalendarsWorkCapacitesReducer,
  productionOrders: productionOrderReducer,
  linkedProductionOrders: linkedProductionOrderReducer,
  productionOrderNumbers: productionOrderNumbersReducer,
  productionOrdersModal: productionOrdersModalReducer,
  statistics: statisticsReducer,
  simulation: simulationReducer,
  reallocationOfPlanning: reallocationReducer,
  overview: overviewReducer,
  orderReplacement: orderReplacementReducer,
  configuration: configurationReducer,
  columnConfig: columnConfigReducer,
});
/**Type used for settings page slices */
export type SettingsType = {
  unitOfMeasure: SettingsPagesResponse;
  features: SettingsPagesResponse;
  parameters: SettingsPagesResponse;
  departments: SettingsPagesResponse;
  colors: SettingsPagesResponse;
  orderTypes: SettingsPagesResponse;
  customers: SettingsPagesResponse;
  positions: SettingsPagesResponse;
  thickness: SettingsPagesResponse;
  selections: SettingsPagesResponse;
  productionOrderTypes: SettingsPagesResponse;
  sizeRanges: SettingsPagesResponse;
  holidays: SettingsPagesResponse;
  materialGroups: SettingsPagesResponse;
  articles: SettingsPagesResponse;
};
/**Main store type, contains types of state for each slice in the store */
export type StoreType = CombinedState<
  {
    auth: LoginResponse;
    sideMenu: InitialState;
    users: UsersResponse;
    tableState: SharedTableStateType;
    operation: OperationsResponse;
    routings: RoutingsResponse;
    workCenter: WorkCentersResponse;
    materials: MaterialsResponse;
    salesOrders: SalesOrdersResponse;
    workCenterCapacities: WorkCapacitesResponse;
    allowedOperations: AllowedOperationsResponse;
    productionCalendars: ProductionCalendarsResponse;
    salesOrdersWithMaterials: SalesOrdersResponse;
    productionCalendarsWorkCapacities: ProductionCalendarWorkCapacitiesResponse;
    productionOrders: ProductionOrdersResponse;
    linkedProductionOrders: LinkedPOInitialStateResponse;
    productionOrdersModal: POModalInitialStateResponse;
    reallocationOfPlanning: BaseResponse;
    statistics: StatisticsResponse;
    simulation: SimulationDataOverview;
    overview: OverviewResponse;
    orderReplacement: OrderReplacementResponse;
    configuration: ConfigurationResponse;
    columnConfig: ColumnConfigResponse;
    productionOrderNumbers: ProductionOrderNumberInitialStateResponse;
  } & SettingsType
>;
/**
 * @param preloadedState Gives initial values to the store, mainly used in tests
 * Creates store with middleware */
export const setupStore = (
  preloadedState?: PreloadedState<RootState>,
): EnhancedStore<StoreType, AnyAction, ThunkMiddleware<StoreType, AnyAction, undefined>[]> => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
