/**
 * @module useEntityDeleteModal
 */

import { AsyncThunk } from '@reduxjs/toolkit';
import { useCallback, useState } from 'react';
import EntityDeleteModal from '../../../pages/settings/components/entity-delete-modal.component';
import { EntityState } from '../../../pages/settings/redux/entity-state.type';
import { IdentifiableEntity, IdType } from '../../../pages/settings/redux/thunks';

export type UseEntityDeleteModalReturnType<EntityMapped> = {
  modal: JSX.Element;
  onDelete: (toDelete?: EntityMapped) => void;
};

export type UseEntityDeleteModalProps<Entity, EntityMapped, SingleEntity> = {
  ns: string;
  deleteThunk: AsyncThunk<IdType, IdType, Record<string, unknown>>;
  state: EntityState<Entity, SingleEntity>;
  getName: (entity: EntityMapped) => string;
};

/**
 * @template Entity type of Entity recieved from the API
 * @template EntityMapped Properties of Entity prepared for the table
 * @template SingleEntity One entity recieved from the API and shown on the Maintain page inside the context.
 * @returns An {@link EntityDeleteModal} component and callback for deleting an Entity from the table
 */
export const useEntityDeleteModal = <
  Entity,
  EntityMapped extends IdentifiableEntity,
  SingleEntity,
>({
  ns,
  deleteThunk,
  state,
  getName,
}: UseEntityDeleteModalProps<
  Entity,
  EntityMapped,
  SingleEntity
>): UseEntityDeleteModalReturnType<EntityMapped> => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<EntityMapped | undefined>(undefined);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const onDelete = useCallback((toDelete?: EntityMapped) => {
    setItemToDelete(toDelete);
    setIsDeleteModalOpen(true);
  }, []);
  const modal = (
    <EntityDeleteModal
      deleteThunk={deleteThunk}
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      ns={ns}
      state={state}
      entity={itemToDelete}
      getName={getName}
    />
  );

  return { modal, onDelete };
};
