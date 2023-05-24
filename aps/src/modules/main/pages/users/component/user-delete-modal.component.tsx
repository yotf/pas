/**
 * @module UserDeleteModal
 */

import { CombinedState } from '@reduxjs/toolkit';
import { FC } from 'react';
import { StoreType } from '../../../../../store';
import { useAppSelector } from '../../../../../store/hooks';
import EntityDeleteModal from '../../settings/components/entity-delete-modal.component';
import { UserMapped, UsersResponse } from '../../settings/redux/user/interfaces';
import { deleteUserThunk } from '../../settings/redux/user/thunks';

export type UserDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: UserMapped;
};
/**
 * @param isOpen Is the modal open. Defined in {@link UsersPage}.
 * @param onClose Closes the modal. Defined in {@link UsersPage}.
 * @param user Initial form values of the user to be created/edited. Defined in {@link UsersPage}.
 * @returns Users modal that uses the {@link EntityDeleteModal} component.
 */
const UserDeleteModal: FC<UserDeleteModalProps> = ({
  isOpen,
  onClose,
  user,
}: UserDeleteModalProps) => (
  <EntityDeleteModal
    isOpen={isOpen}
    onClose={onClose}
    ns='users'
    state={useAppSelector((state: CombinedState<StoreType>): UsersResponse => state.users)}
    entity={user}
    getName={({ firstName, lastName }: UserMapped): string => `${firstName} ${lastName}`}
    deleteThunk={deleteUserThunk}
  />
);

export default UserDeleteModal;
