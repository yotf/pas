/**
 * @module SettingsRoutes
 */

import { isUserNotAdmin } from '@/modules/shared/utils/utils';
import Colors from '../pages/colors/colors.page';
import Customers from '../pages/customers/customers.page';
import Articles from '../pages/articles/articles.page';
import Departments from '../pages/departments/departments.page';
import Features from '../pages/features/features.page';
import Holidays from '../pages/holidays/holidays.page';
import OrderTypes from '../pages/orderTypes/OrderTypes.page';
import MaterialGroups from '../pages/materialGroups/materialGroups.page';
import Parameters from '../pages/parameters/parameters.page';
import Positions from '../pages/positions/positions.page';
import Selections from '../pages/selections/selections.page';
import ProductionOrderTypes from '../pages/productionOrderTypes/productionOrderTypes.page';
import {
  COLORS,
  CUSTOMERS,
  DEPARTMENT,
  FEATURES,
  ORDER_TYPES,
  MATERIAL_GROUPS,
  PARAMETERS,
  POSITIONS,
  SIZE_RANGES,
  THICKNESS,
  SELECTIONS,
  PRODUCTION_ORDER_TYPES,
  UNITS_OF_MEASURE,
  USERS,
  HOLIDAYS,
  ARTICLES,
  CONFIGURATION,
  COLUMN_CONFIG,
} from '../pages/settings/consts/pageRoutes';
import SizeRanges from '../pages/sizeRanges/sizeRanges.page';
import Thickness from '../pages/thickness/thickness.page';
import UnitsOfMeasure from '../pages/unitOfMeasure/unitOfMeasure.page';
import Users from '../pages/users/users.page';
import { Route } from './route.type';
import Configuration from '../pages/configuration/configuration.page';
import ColumnsConfig from '../pages/columns/columns.page';

export const sharedRoutes: Route[] = [
  {
    element: <Users />,
    path: USERS,
    name: USERS,
    shouldDisplay: () => !isUserNotAdmin(),
  },
  {
    element: <UnitsOfMeasure />,
    path: UNITS_OF_MEASURE,
    name: UNITS_OF_MEASURE,
  },
  { element: <Configuration />, path: CONFIGURATION, name: CONFIGURATION },
  { element: <ColumnsConfig />, path: COLUMN_CONFIG, name: COLUMN_CONFIG },
  { element: <Departments />, path: DEPARTMENT, name: DEPARTMENT },
  // { element: <Parameters />, path: PARAMETERS, name: PARAMETERS },
  { element: <Features />, path: FEATURES, name: FEATURES },
  { element: <Colors />, path: COLORS, name: COLORS },
  { element: <OrderTypes />, path: ORDER_TYPES, name: ORDER_TYPES },
  { element: <Customers />, path: CUSTOMERS, name: CUSTOMERS },
  { element: <Positions />, path: POSITIONS, name: POSITIONS },
  { element: <Thickness />, path: THICKNESS, name: THICKNESS },
  { element: <Selections />, path: SELECTIONS, name: SELECTIONS },
  { element: <ProductionOrderTypes />, path: PRODUCTION_ORDER_TYPES, name: PRODUCTION_ORDER_TYPES },
  { element: <SizeRanges />, path: SIZE_RANGES, name: SIZE_RANGES },
  { element: <Holidays />, path: HOLIDAYS, name: HOLIDAYS },
  { element: <MaterialGroups />, path: MATERIAL_GROUPS, name: MATERIAL_GROUPS },
  { element: <Articles />, path: ARTICLES, name: ARTICLES },
];
