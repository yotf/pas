/**
 * @module UserModal
 */

import { CombinedState } from '@reduxjs/toolkit';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { StoreType } from '../../../../../store';
import EntityModal from '../../settings/components/entity-modal.component';
import { useEntityForm } from '../../settings/hooks/entity-form';
import { UserFormData, UsersResponse } from '../../settings/redux/user/interfaces';
import { upsertUserThunk } from '../../settings/redux/user/thunks';
import { useUserFormErrors } from '../hooks/user-form-errors';
import { useUserSchema } from '../hooks/user-schema';
import UserForm from './user-form.component';

export type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserFormData;
};
/**
 *
 * @param isOpen Is the modal open. Defined in {@link UsersPage}.
 * @param onClose Closes the modal. Defined in {@link UsersPage}.
 * @param user Initial form values of the user to be created/edited. Defined in {@link UsersPage}.
 * @returns Users modal that uses the {@link EntityModal} component with {@link UserForm}. The Form is created using {@link UseEntityForm } hook and validated via {@link UserSchema | useUserSchema} hook.
 */
const UserModal: FC<UserModalProps> = ({ isOpen, onClose, user }: UserModalProps) => {
  const validationSchema = useUserSchema(user);
  const form = useEntityForm({ entity: user, validationSchema, isOpen });
  useUserFormErrors(form, isOpen);
  return (
    <FormProvider {...form}>
      <EntityModal
        isOpen={isOpen}
        ns='users'
        onClose={onClose}
        selector={(state: CombinedState<StoreType>): UsersResponse => state.users}
        upsertThunk={upsertUserThunk}
        validationSchema={validationSchema}
        entity={user}
      >
        <UserForm user={user} />
      </EntityModal>
    </FormProvider>
  );
};

export default UserModal;
