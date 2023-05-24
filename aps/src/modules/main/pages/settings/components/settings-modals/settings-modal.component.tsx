/**
 * @module SettingsModal
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { StoreType } from '@/store';
import { AsyncThunkAction, CombinedState } from '@reduxjs/toolkit';
import { FormProvider } from 'react-hook-form';
import { RequiredStringSchema } from 'yup/lib/string';
import { AnyObject } from 'yup/lib/types';
import { SettingsPageItem, SettingsPagesResponse } from '../../consts/interfaces';
import { useEntityForm } from '../../hooks/entity-form';
import { useSettingsFormErrors } from '../../hooks/useSettingsFormErrors';
import { useSettingsSchema } from '../../hooks/useSettingsSchema';
import EntityModal from '../entity-modal.component';
import SettingsForm from './settings-form.component';

export type SettingsModalProps<
  T extends SettingsPageItem = SettingsPageItem,
  K extends SettingsPagesResponse = SettingsPagesResponse,
> = {
  isOpen: boolean;
  onClose: () => void;
  settingsEntity: T;
  nameSpace: string;
  selector: (state: CombinedState<StoreType>) => K;
  upsertThunk: (data: T) => AsyncThunkAction<T, T, Record<string, unknown>>;
  extendsSettingsSchemaProps?: (
    requiredStringCallback: RequiredStringSchema<string | undefined, AnyObject>,
    translateCallback: (value: string, options?: Record<string, string> | undefined) => string,
  ) => Partial<Shape<SettingsPageItem>>;
  children?: JSX.Element;
  propForValidation?: keyof T;
  callbackAfterSubmit?: () => void;
};
/**
 * @param isOpen State that opens or closes the modal
 * @param onClose Callback called when the modal closes
 * @param settingsEntity Entity of type SettingsPageItem used in the modal
 * @param nameSpace Localization Namespace
 * @param selector Redux state used in the modal
 * @param upsertThunk Sends an API request for creating/editing an entity of type T
 * @param extendsSettingsSchemaProps Extends settings page schema with additional properties. (eg holidayDate, unit, country)
 * @param children Form rendered inside the modal. Default value is {@link SettingsForm}. If the settingsEntity has additional properties a different form needs to be rendered.
 * @param propForValidation Fields in form that need to be unique in the table. Default if 'code' field.
 * @param callbackAfterSubmit additional callback that needs
 * @param getName Name of IdentifiableEntity that will be deleted.
 * @returns A modal for creating/editing a settings page item of type T
 */
const SettingsModal = ({
  isOpen,
  onClose,
  settingsEntity,
  nameSpace,
  selector,
  upsertThunk,
  extendsSettingsSchemaProps,
  children,
  propForValidation,
  callbackAfterSubmit,
}: SettingsModalProps): JSX.Element => {
  const validationSchema = useSettingsSchema(nameSpace, extendsSettingsSchemaProps);
  const form = useEntityForm({ entity: settingsEntity, validationSchema, isOpen });
  useSettingsFormErrors(form, nameSpace, selector, isOpen, propForValidation);
  const formComponent = children ?? <SettingsForm />;
  return (
    <FormProvider {...form}>
      <EntityModal
        isOpen={isOpen}
        ns={nameSpace}
        onClose={onClose}
        selector={selector}
        upsertThunk={upsertThunk}
        entity={settingsEntity}
        validationSchema={validationSchema}
        callbackAfterSubmit={callbackAfterSubmit ?? ((): void => {})}
      >
        {formComponent}
      </EntityModal>
    </FormProvider>
  );
};

export default SettingsModal;
