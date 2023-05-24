/**
 * @module OverviewContext
 */

import { createContext, PropsWithChildren } from 'react';
import { OverviewFormData } from '../../settings/redux/overview/interfaces';

export type OverviewContextValue = {
  /** Localization Namespace */
  ns: string;
  /** Data entered by the user. Extracted from overview form defined in {@link OverviewPage} */
  overviewFormData: OverviewFormData;
};
/** Context used for passing down data inside {@link OverviewPage} */
export const OverviewContext = createContext<OverviewContextValue>({
  ns: '',
  overviewFormData: {} as OverviewFormData,
});

export type ProviderProps = PropsWithChildren & {
  value: OverviewContextValue;
};
/** Overview Context Provider. Makes value data available to all children */
export const OverviewContextProvider = ({ value, children }: ProviderProps): JSX.Element => {
  return <OverviewContext.Provider value={value}>{children}</OverviewContext.Provider>;
};
