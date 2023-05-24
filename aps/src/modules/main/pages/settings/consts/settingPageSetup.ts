/**
 * @module useSettingPageSetup
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { StoreType } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CombinedState } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { resetPagination } from '../redux/sharedTableState/slice';
import { SettingsPageItem, SettingsPagesResponse } from './interfaces';

export interface SetItemModalResponse {
  itemToDelete: SettingsPageItem | undefined;
  isDeleteModalOpen: boolean;
  isModalOpen: boolean;
  settingsItem: SettingsPageItem | undefined;
  disableButton: (obj: SettingsPageItem) => boolean | undefined;
  showModal: (itemToEdit?: SettingsPageItem) => void;
  closeModal: () => void;
  onDelete: (toDelete?: SettingsPageItem) => void;
  closeDeleteModal: () => void;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
}
/**
 *
 * @param stateSelector Redux state to be used
 * @param predefineEmptyItem Additional properties which extend the settingsPageItem interface (eg holidayDate)
 * @returns Prepared logic for settings page (eg articles page, selections page...) modals.
 */
export const useSettingPageSetup = (
  stateSelector: (state: CombinedState<StoreType>) => SettingsPagesResponse,
  predefineEmptyItem?: Partial<SettingsPageItem>,
): SetItemModalResponse => {
  const { translate } = useTranslate({ ns: 'settings', keyPrefix: 'table' });
  const { data } = useAppSelector(stateSelector);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settingsItem, setSettingsItem] = useState<SettingsPageItem | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SettingsPageItem | undefined>(undefined);

  const showModal = useCallback(
    (itemToEdit?: SettingsPageItem) => {
      const itemData =
        itemToEdit && (data as SettingsPageItem[]).find((u) => u.id === itemToEdit?.id);

      const extedSettingsItem = predefineEmptyItem ?? {};

      setSettingsItem(
        itemData ??
          ({
            code: '',
            name: '',
            isActive: true,
            ...extedSettingsItem,
          } as SettingsPageItem),
      );
      setIsModalOpen(true);
    },
    [data, predefineEmptyItem],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onDelete = useCallback((toDelete?: SettingsPageItem) => {
    setItemToDelete(toDelete);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const disableButton = useCallback((obj: SettingsPageItem) => {
    return obj.isActive;
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetPagination());
    };
  }, [dispatch]);

  return {
    itemToDelete,
    isDeleteModalOpen,
    isModalOpen,
    settingsItem,
    disableButton,
    showModal,
    closeModal,
    onDelete,
    closeDeleteModal,
    translate,
  };
};
