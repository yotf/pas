/**
 * @module ApiUrls
 */

export const BASE_UNIT_OF_MEASURE_API = 'UnitOfMeasures';
export const BASE_USER_API = 'users';
export const ROLES_API = `${BASE_USER_API}/roles`;
export const BASE_FEATURES_API = 'Features';
export const BASE_DEPARTMENTS_API = 'Departments';
export const BASE_PARAMETERS_API = 'Parameters';
export const BASE_COLORS_API = 'Colors';
export const BASE_ORDER_TYPES_API = 'OrderTypes';
export const BASE_CUSTOMERS_API = 'Customers';
export const BASE_POSITIONS_API = 'Positions';
export const BASE_THICKNESS_API = 'Thicknesses';
export const BASE_SELECTIONS_API = 'Selections';
export const BASE_PRODUCTION_ORDER_TYPES_API = 'ProductionOrderTypes';
export const BASE_SIZE_RANGES_API = 'SizeRanges';
export const BASE_HOLIDAYS_API = 'Holidays';
export const BASE_MATERIAL_GROUPS_API = 'MaterialGroups';
export const BASE_ARTICLES_API = 'Articles';
export const BASE_OPERATIONS_API = 'operations';
export const BASE_ROUTINGS_API = 'routings';
export const BASE_WORK_CENTERS_API = 'WorkCenters';
export const BASE_MATERIALS_API = 'materials';
export const BASE_SALES_ORDERS_API = 'SalesOrders';

export const BASE_SIMULATION_API = 'Simulations';
export const BASE_SALES_ORDERS_MATERIALS_API = `${BASE_SALES_ORDERS_API}/getSalesOrdersWithMaterials`;
export const BASE_PRODUCTION_CALENDAR_API = 'ProductionCalendar';
export const BASE_PRODUCTION_ORDER_API = 'ProductionOrders';
export const BASE_STATISTICS_API = 'Statistics';
export const BASE_REALLOCATION_API = 'ReallocationOfPlanning';
export const BASE_OVERVIEW_API = 'Overviews';
export const BASE_ORDER_REPLACEMENT = 'OrderReplacement';
export const BASE_ORDER_REPLACEMENT_RESPONSE = `${BASE_ORDER_REPLACEMENT}/table`;
export const ORDER_REPLACEMENT_SALES_ORDER_BY_CUSTOMER_ID = `${BASE_ORDER_REPLACEMENT}/getSalesOrdersByCustomer`;
export const ORDER_REPLACEMENT_GENERATE = `${BASE_ORDER_REPLACEMENT}/generateData`;
export const ORDER_REPLACEMENT_REPLACE_ORDERS = `${BASE_ORDER_REPLACEMENT}/replaceOrders`;
export const PRODUCTION_ORDER_STATUS_API = `${BASE_PRODUCTION_ORDER_API}/productionOrdersStatus`;
export const PRODUCTION_CALENDAR_WORK_CAPACITIES_API = `${BASE_PRODUCTION_CALENDAR_API}/getProductionCalendarWorkCapacities`;
export const PRODUCTION_CALENDAR_GENERATE_API = `${BASE_PRODUCTION_CALENDAR_API}/generateProductionCalendarCreation`;
export const PRODUCTION_ORDER_GENERATE_FROM_SALES_ORDER = `${BASE_PRODUCTION_ORDER_API}/createProductionOrderFromSalesOrder`;
export const PRODUCTION_ORDER_GET_ORDER_NUMBERS = `${BASE_PRODUCTION_ORDER_API}/getOrderNumbers`;
export const PRODUCTION_ORDER_EXECUTE_API = `${BASE_PRODUCTION_ORDER_API}/PORoutingOperationExecute`;
export const WORK_CENTER_GET_CAPACITIES_API = `${BASE_WORK_CENTERS_API}/getAllWorkCapacitiesByWorkCenter`;
export const WORK_CENTER_GET_ALLOWED_OPERATIONS_BY_WORK_CENTER_API = `${BASE_WORK_CENTERS_API}/getAllAllowedOperationsByWorkCenter`;
export const WORK_CENTER_GET_ACTIVE_OPERATIONS_BY_ALLOCATION_API = `${BASE_WORK_CENTERS_API}/getAllActiveOperationsByAllocationBased`;
export const WORK_CENTER_DELETE_ALLOWED_OPERATION = `${BASE_WORK_CENTERS_API}/deleteAllowedOperation`;
export const WORK_CENTERS_WITH_OPERATIONS_API = `${BASE_WORK_CENTERS_API}/getWorkCentersWithAllowedOperations`;
export const STATISTICS_DELAYED_ORDERS_API = `${BASE_STATISTICS_API}/getDelayedOrders`;
export const STATISTICS_GENERATE_DATA_API = `${BASE_STATISTICS_API}/generateData`;
export const BASE_CONFIGURATION_API = 'Configurations';
export const CONFIGURATION_GET_LINKED_UOMS = `${BASE_CONFIGURATION_API}/getUoMByQuantityType`;
export const PRODUCTION_ORDER_GET_LINKED = `${BASE_PRODUCTION_ORDER_API}/getLinkedProductionOrders`;
export const BASE_COLUMNS_API = 'Columns';
export const SAVE_VISIBLE_COLUMNS_API = `${BASE_COLUMNS_API}/overviewColumns`;
export const GET_VISIBLE_COLUMNS_API = `${BASE_COLUMNS_API}/getOverviewColumns`;
