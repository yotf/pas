/**
 * @module MaterialsMaintainPage
 */

import { useAppSelector } from '@/store/hooks';
import { FC, useCallback, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { MaintainContextProvider } from '../../components/maintain/contexts/maintain.context';
import MaintainHeader from '../../components/maintain/maintain-header';
import { useEntityDeleteModal } from '../../components/table/hooks/useEntityDeleteModal';
import { useRedirectModal } from '../operations/hooks/useRedirectModal';
import { Material } from '../settings/redux/materials/interfaces';
import { materialThunks } from '../settings/redux/materials/thunks';
import { useMaterialsForm } from './hooks/useMaterialsForm';
import MaterialsForm from './materials-form';
import './materials-form.scss';
export interface MaterialMaintainProps {
  copy?: boolean;
}
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The {@link UseMaterialsForm} hook is used to create a form and connect it with {@link MaintainContext}.
 * The page defines a {@link useEntityDeleteModal | delete modal} and a {@link useRedirectModal | redirect modal}.
 * Redux slice, modals and form are passed to {@link MaintainContextValue} and are available everywhere inside {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader} and {@link MaterialsForm} component all wrapped inside a {@link MaintainContext.MaintainContextProvider }
 */
const MaterialsMaintain: FC<MaterialMaintainProps> = ({ copy }: MaterialMaintainProps) => {
  const sliceState = useAppSelector((state) => state.materials);
  const { loading } = sliceState;
  const form = useMaterialsForm({ state: sliceState, copy });
  const getName = useCallback((entity: Material): string => entity.name, []);
  const { deleteThunk } = materialThunks;
  const {
    formState: { isDirty },
  } = form;
  const ns = 'materials';

  const { onDelete, modal: deleteModal } = useEntityDeleteModal({
    ns,
    deleteThunk,
    state: sliceState,
    getName,
  });
  const { redirectModal, openRedirectModal } = useRedirectModal({
    isDirty,
  });

  const contextValue = useMemo(
    () => ({
      ns,
      copying: !!copy,
      crudThunk: materialThunks,
      state: sliceState,
      onDelete,
      openRedirectModal,
    }),
    [copy, onDelete, openRedirectModal, sliceState],
  );
  const isEdit = window.location.toString().includes('edit');
  return (
    <FormProvider {...form}>
      <MaintainContextProvider value={contextValue}>
        <div
          className={'workcenters-container ' + (isEdit ? 'edit' : 'new')}
          data-testid='maintain'
        >
          <MaintainHeader />
          {!loading && <MaterialsForm />}
        </div>
        {deleteModal}
        {redirectModal}
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default MaterialsMaintain;
