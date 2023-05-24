/**
 * @module MaintainContext
 */

import { createContext, PropsWithChildren } from 'react';
import { State } from '../../../pages/settings/redux/slice';
import { CrudThunks, IdentifiableEntity } from '../../../pages/settings/redux/thunks';

/** * Maintain context wraps around maintain pages and provides them with the same logic for post/put, delete and copy functionalities, but for different entities.s */

/**
 * @template Entity Entity recieved from the API
 * @template SingleEntity One entity recieved from the API or remapped and shown on the Maintain page inside the context.
 * @template FormData Data collected from user inputs and used to make API requests
 */
export type MaintainContextValue<Entity, SingleEntity, FormData> = {
  /**Localization namespace */
  ns: string;
  /** Determines if the user is on a page with copied entity values */
  copying?: boolean;
  /** redux state from which data is extracted */
  state: State<Entity, SingleEntity>;
  /** Used crud thunks for post, put and delete actions */
  crudThunk: CrudThunks<Entity, SingleEntity, FormData>;
  /** Function to be executed on delete button click */
  onDelete?: (entity?: Entity) => void;
  /** Redirect modal function
   * @param copyRedirect Determines if the user is on copy page, or on a regular maintain page and  renders different modal content
   */
  openRedirectModal?: (callback: () => void, copyRedirect?: boolean) => void;
  /** By default all maintain pages have the same request validations. If useDifferentChecks is true, a different validation can be used */
  useDifferentChecks?: boolean;
};

/**
 * Maintain context wraps around maintain pages and provides them with the same logic for post/put, delete and copy functionalities, but for different entities.
 */
export const MaintainContext = createContext<MaintainContextValue<any, any, any>>({
  ns: '',
  copying: false,
  state: {
    data: [],
    filtered: [],
    loading: false,
  },
  crudThunk: null as unknown as CrudThunks<
    IdentifiableEntity,
    IdentifiableEntity,
    Partial<IdentifiableEntity>
  >,
  onDelete: () => {},
  openRedirectModal: () => {},
  useDifferentChecks: false,
});
/**
 * Maintain Context Provider. Provides children inside the context with values of {@link MaintainContextValue} type .
 */
export type ProviderProps<Entity, SingleEntity, FormData> = PropsWithChildren & {
  value: MaintainContextValue<Entity, SingleEntity, FormData>;
};
/**
 * Maintain Context Provider. Provides children inside the context with values of {@link MaintainContextValue} type .
 */
export const MaintainContextProvider = <Entity, SingleEntity, FormData>({
  value,
  children,
}: ProviderProps<Entity, SingleEntity, FormData>): JSX.Element => {
  return <MaintainContext.Provider value={value}>{children}</MaintainContext.Provider>;
};
