/**
 * @module WorkCenterMaintain
 */

import { useAppSelector } from '@/store/hooks';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { MaintainContextProvider } from '@/modules/main/components/maintain/contexts/maintain.context';
import MaintainHeader from '../../components/maintain/maintain-header';
import { useEntityDeleteModal } from '../../components/table/hooks/useEntityDeleteModal';
import { useRedirectModal } from '../operations/hooks/useRedirectModal';
import { WorkCenter } from '../settings/redux/workCenters/interfaces';
import { WorkCenterThunks } from '../settings/redux/workCenters/thunks';
import { useWorkCenterMaintainSetup } from './hooks/useWorkCenterMaintainSetup';
import WorkCenterForm from './workCenter-form';
import WorkCenterMaintainTable from './workCenter-table';
import './workCenterLayout.scss';
export interface RoutingMaintainProps {
  copy?: boolean;
}
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form
 * The {@link useWorkCenterMaintainSetup} hook is used to create a form and return it.
 * The page defines a {@link useEntityDeleteModal | delete modal} and a {@link useRedirectModal | redirect modal}.
 * Redux slice, modals and form are passed to {@link MaintainContextValue} and are to context children inside {@link MaintainContext.MaintainContextProvider}.
 * @returns A {@link MaintainHeader}, {@link WorkCenterForm} and {@link WorkCenterTable} component all wrapped in a {@link MaintainContext.MaintainContextProvider }
 */
const WorkCenterMaintain: FC<RoutingMaintainProps> = ({ copy = false }) => {
  const [isFormulaSelected, setIsFormulaSelected] = useState<boolean>(false);
  const { form, isLoaded } = useWorkCenterMaintainSetup(copy, isFormulaSelected);

  const sliceState = useAppSelector((state) => state.workCenter);
  const ns = 'workCenters';
  const { deleteThunk } = WorkCenterThunks;
  const getName = useCallback((entity: WorkCenter): string => entity.name, []);
  const {
    formState: { isDirty },
    trigger,
    resetField,
  } = form;

  const formulaCallback = (formulaSelected: boolean) => {

    setIsFormulaSelected(formulaSelected);
  };

  useEffect(() => {
    trigger('weightCapacity');
    resetField('weightCapacity');
  }, [isFormulaSelected]);
  const { onDelete, modal: deleteModal } = useEntityDeleteModal({
    ns,
    deleteThunk,
    state: sliceState,
    getName,
  });
  const { redirectModal, openRedirectModal } = useRedirectModal({
    isDirty,
  });
  const isEdit = window.location.toString().includes('edit');
  return (
    <FormProvider {...form}>
      <MaintainContextProvider
        value={{
          ns,
          copying: !!copy,
          crudThunk: WorkCenterThunks,
          state: sliceState,
          onDelete,
          openRedirectModal,
        }}
      >
        <div
          className={'workcenters-container ' + (isEdit ? 'edit' : 'new')}
          data-testid='workcenters-maintain'
        >
          <MaintainHeader />
          {isLoaded && <WorkCenterForm form={form} formulaCallback={formulaCallback} />}
          {isLoaded && <WorkCenterMaintainTable form={form} />}
          {deleteModal}
          {redirectModal}
        </div>
      </MaintainContextProvider>
    </FormProvider>
  );
};

export default WorkCenterMaintain;
