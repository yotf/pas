/**
 * @module AppRoutes
 */

import { isUserNotAdmin } from '@/modules/shared/utils/utils';
import { redirect, RouteObject } from 'react-router-dom';
import PageOutlet from '../components/page.outlet';
import {
  COPY_PAGE,
  EDIT_PAGE,
  MATERIAL_PAGE,
  NEW_PAGE,
  OPERATIONS_PAGE,
  ORDER_REPLACEMENT_PAGE,
  OVERVIEW_PAGE,
  PRODUCTION_CALENDAR_PAGE,
  PRODUCTION_ORDER_PAGE,
  ROUTING_PAGE,
  SALES_ORDER_PAGE,
  SETTINGS_PAGE,
  SIMULATION_PAGE,
  STATISTICS_PAGE,
  WORK_CENTER_PAGE,
} from '../consts/pageRouter';
import MaterialsTable from '../pages/materials/materials.page';
import MaterialsMaintain from '../pages/materials/materialsMaintain.page';
import OperationsTable from '../pages/operations/operations.page';
import OperationsMaintain from '../pages/operations/operationsMaintain.page';
import OrderReplacementPage from '../pages/orderReplacement/orderReplacement.page';
import Overview from '../pages/overview/overview.page';
import ProductionCalendarTable from '../pages/productionCalendars/productionCalendars.page';
import ProductionCalendarMaintain from '../pages/productionCalendars/productionCalendarsMaintain.page';
import ProductionOrdersTable from '../pages/productionOrders/productionOrders.page';
import ProductionOrderMaintain from '../pages/productionOrders/productionOrdersMaintain.page';
import RoutingsTable from '../pages/routings/routings.page';
import RoutingsMaintain from '../pages/routings/routingsMaintain.page';
import SalesOrderMaintain from '../pages/salesOrders/salesOrderMaintain.page';
import SalesOrdersTable from '../pages/salesOrders/salesOrders.page';
import { SETTINGS_UNITS, SETTINGS_USERS } from '../pages/settings/consts/pageRoutes';
import SettingsPage from '../pages/settings/settings.page';
import Statistics from '../pages/statistics/statistics.page';
import Simulation from '../pages/simulation/simulation.page';
import WorkCenterTable from '../pages/workCenter/workcenter.page';
import WorkCenterMaintain from '../pages/workCenter/workCenterMaintain.page';
import { sharedRoutes } from './settings.routes';

export type Route = RouteObject & { name: string };

const routes: Route[] = [
  {
    element: <SettingsPage />,
    path: SETTINGS_PAGE,
    loader: ({ request }): Response | undefined => {
      if (request.url.endsWith(SETTINGS_PAGE)) {
        return redirect(isUserNotAdmin() ? SETTINGS_UNITS : SETTINGS_USERS);
      }
    },
    children: sharedRoutes,
    name: 'settings',
  },
  {
    path: OPERATIONS_PAGE,
    name: 'operations',
    element: <PageOutlet />,
    children: [
      {
        path: NEW_PAGE,
        element: <OperationsMaintain />,
      },
      {
        path: EDIT_PAGE,
        element: <OperationsMaintain />,
      },
      {
        path: COPY_PAGE,
        element: <OperationsMaintain copy={true} />,
      },
      { element: <OperationsTable />, index: true },
    ],
  },
  {
    path: ROUTING_PAGE,
    name: 'routing',
    element: <PageOutlet />,
    children: [
      {
        path: NEW_PAGE,
        element: <RoutingsMaintain />,
      },
      {
        path: EDIT_PAGE,
        element: <RoutingsMaintain />,
      },
      {
        path: COPY_PAGE,
        element: <RoutingsMaintain copy={true} />,
      },
      { element: <RoutingsTable />, index: true },
    ],
  },
  {
    element: <PageOutlet />,
    path: WORK_CENTER_PAGE,
    name: 'work_center',
    children: [
      {
        path: NEW_PAGE,
        element: <WorkCenterMaintain />,
      },
      {
        path: EDIT_PAGE,
        element: <WorkCenterMaintain />,
      },
      {
        path: COPY_PAGE,
        element: <WorkCenterMaintain copy={true} />,
      },
      { index: true, element: <WorkCenterTable /> },
    ],
  },
  {
    path: PRODUCTION_CALENDAR_PAGE,
    name: 'production_calendar',
    children: [
      {
        path: NEW_PAGE,
        element: <ProductionCalendarMaintain />,
      },
      {
        path: EDIT_PAGE,
        element: <ProductionCalendarMaintain checking={true} />,
      },
      { index: true, element: <ProductionCalendarTable /> },
    ],
  },
  {
    path: MATERIAL_PAGE,
    name: 'material',
    children: [
      {
        path: NEW_PAGE,
        element: <MaterialsMaintain />,
      },
      {
        path: EDIT_PAGE,
        element: <MaterialsMaintain />,
      },
      {
        path: COPY_PAGE,
        element: <MaterialsMaintain copy={true} />,
      },
      { index: true, element: <MaterialsTable /> },
    ],
  },
  {
    path: SALES_ORDER_PAGE,
    name: 'sales_order',
    children: [
      {
        path: NEW_PAGE,
        element: <SalesOrderMaintain copy={true} />,
      },
      {
        path: EDIT_PAGE,
        element: <SalesOrderMaintain copy={true} />,
      },
      { index: true, element: <SalesOrdersTable /> },
    ],
  },
  {
    path: PRODUCTION_ORDER_PAGE,
    name: 'production_order',
    children: [
      {
        path: NEW_PAGE,
        element: <ProductionOrderMaintain copy={true} />,
      },
      {
        path: EDIT_PAGE,
        element: <ProductionOrderMaintain copy={true} />,
      },
      { index: true, element: <ProductionOrdersTable /> },
    ],
  },
  {
    path: OVERVIEW_PAGE,
    name: 'overview',
    element: <Overview />,
  },
  {
    path: ORDER_REPLACEMENT_PAGE,
    name: 'order_replacement',
    element: <OrderReplacementPage />,
  },
  {
    path: STATISTICS_PAGE,
    name: 'statistics',
    element: <Statistics />,
  },
  {
    path: SIMULATION_PAGE,
    name: 'simulation',
    element: <Simulation />,
  },
];

export default routes;
