/**
 * @module UsersPage
 */

import { useSettingsCustomColumns } from '@/modules/shared/hooks/table/settings/useSettingsCustomColumns.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import SettingsTable from '../settings/components/settingsTable';
import { resetPagination } from '../settings/redux/sharedTableState/slice';
import { UserFormData, UserMapped } from '../settings/redux/user/interfaces';
import UserDeleteModal from './component/user-delete-modal.component';
import UserModal from './component/user-modal.component';
import { useUsers } from './users.hook';
/**
 * Uses the {@link UsersHook } hook to get map and prepare form data.
 * Passes down the mapped data and logic created on the page to {@link SettingsTable} for table rendering, and to {@link UserModal} and {@link UserDeleteModal}.
 * @returns Users table with modals for creating/updating and deleting users.
 */
const Users: FC = () => {
  const { loading, uiData, form } = useUsers();
  const { data } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState<UserFormData | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<UserMapped | undefined>(undefined);

  const { translate } = useTranslate({ ns: 'users-table' });

  const showModal = useCallback(
    (userToEdit?: UserMapped) => {
      const userData = userToEdit && data.find((u) => u.id === userToEdit?.id);
      const userFormData = userData && ({ ...userData, password: '' } as UserFormData);
      setUser(
        userFormData ?? {
          id: '',
          email: '',
          firstName: '',
          isActive: true,
          lastName: '',
          password: '',
          phoneNumber: '',
          positionId: undefined,
          roleId: undefined,
          userName: '',
          language: '',
        },
      );
      setIsModalOpen(true);
    },
    [data],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onDelete = useCallback((toDelete?: UserMapped) => {
    setUserToDelete(toDelete);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const disableButton = useCallback((obj: UserMapped) => {
    return obj.isActive;
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetPagination());
    };
  }, [dispatch]);

  return (
    <FormProvider {...form}>
      <div data-testid='users' className='users'>
        <SettingsTable
          isLoading={loading!}
          filteredData={uiData}
          translateNs='users-table'
          onNew={showModal}
          onEdit={showModal}
          onDelete={onDelete}
          customColumns={useSettingsCustomColumns(translate)}
          disableDeleteButtonCondition={disableButton}
          disableExportToExcelButton={true}
        />
        <UserModal isOpen={isModalOpen} user={user!} onClose={closeModal} />
        <UserDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          user={userToDelete}
        />
      </div>
    </FormProvider>
  );
};
export default Users;
