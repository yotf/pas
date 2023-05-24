/**
 * @module SettingsDeleteModal
 */

import { StoreType } from '@/store';
import { AsyncThunkAction, CombinedState } from '@reduxjs/toolkit';
import { FC } from 'react';
import { useAppSelector } from '../../../../../../store/hooks';
import { SettingsPageItem, SettingsPagesResponse } from '../../consts/interfaces';
import { IdType } from '../../redux/thunks';
import EntityDeleteModal from '../entity-delete-modal.component';

export type SettingsDeleteModalProps<K extends SettingsPagesResponse = SettingsPagesResponse> = {
  isOpen: boolean;
  onClose: () => void;
  settingsEntity: SettingsPageItem;
  selector: (state: CombinedState<StoreType>) => K;
  nameSpace: string;
  deleteThunk: (id: any) => AsyncThunkAction<IdType, IdType, Record<string, unknown>>;
};
/**
 * @param isOpen State that opens or closes the modal
 * @param onClose Callback called when the modal closes
 * @param settingsEntity Entity of type SettingsPageItem used in the modal
 * @param nameSpace Localization Namespace
 * @param selector Redux state used in the modal
 * @param deleteThunk Sends an API request for deleting an entity of type SettingsPageItem
 * @returns A modal for deleting a settings page item of type SettingsPageItem. Used in settings pages.
 */
const SettingsDeleteModal: FC<SettingsDeleteModalProps> = ({
  isOpen,
  onClose,
  settingsEntity,
  selector,
  deleteThunk,
  nameSpace,
}: SettingsDeleteModalProps) => (
  <EntityDeleteModal
    isOpen={isOpen}
    onClose={onClose}
    ns={nameSpace}
    state={useAppSelector(selector)}
    entity={settingsEntity}
    getName={({ name }: SettingsPageItem): string => `${name}`}
    deleteThunk={deleteThunk}
  />
);

export default SettingsDeleteModal;
