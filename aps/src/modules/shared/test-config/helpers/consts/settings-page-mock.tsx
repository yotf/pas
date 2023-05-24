/**@module SettingsPagesTestMock */
import { SETTINGS_PAGE } from '@/modules/main/consts/pageRouter';
import {
  SettingsPageId,
  SettingsPageItem,
  SettingsPagesResponse,
} from '@/modules/main/pages/settings/consts/interfaces';
import { Outlet, RouteObject } from 'react-router-dom';
import { RoutingOptions } from '../../renderWrapper';
/** Setup for settings pages tests. Wraps the page in router and provides it with mocked redux data */
export const settingsPageRoutes = (elementPage: JSX.Element): RouteObject[] => [
  {
    path: SETTINGS_PAGE,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: elementPage,
      },
    ],
  },
];

export const mockedSettingsItem: SettingsPageId = {
  code: 'test 1',
  name: 'test 1',
  id: 1,
};

export type MockedSettingsItemForPutType = {
  id: number;
  name: string;
  code: string;
};

export const mockedSettingsItemForPut: MockedSettingsItemForPutType = {
  code: 'test 1',
  name: 'test 1',
  id: 1,
};

export const mockedSettingsItemForPost: SettingsPageItem = {
  id: 0,
  code: 'test 1',
  name: 'test 1',
};

export const mockedSettingsData: SettingsPageItem[] = [
  {
    code: 'test 1',
    name: 'test 1',
    id: 1,
  },
  {
    code: 'test 2',
    name: 'test 2',
    id: 2,
  },
  {
    code: 'test 3',
    name: 'test 3',
    id: 3,
  },
];

export const expectedSettingsPageResponse: SettingsPagesResponse = {
  data: mockedSettingsData,
  loading: false,
  error: undefined,
  filtered: mockedSettingsData,
};

export const routerSettingsOptions = (elementPage: JSX.Element): RoutingOptions => {
  return {
    extraRoutes: settingsPageRoutes(elementPage),
    goToUrl: SETTINGS_PAGE,
  };
};
