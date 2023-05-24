/**
 * @module WorkCenterTable
 */

import plus from '@/assets/plus.png';
import CustomButton from '@/modules/shared/components/button/button.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { WorkCenterFormData } from '../settings/redux/workCenters/interfaces';
import { WorkCapacityMapped } from '../settings/redux/workcenterCapacities/interfaces';
import { AllowedOperationMapped } from './../settings/redux/allowedOperations/interfaces';
import { useAllowedOperationsModal } from './hooks/useAllowedOperationsModal';
import { useWorkCenterTableSetup } from './hooks/useWorkCenterTableSetup';
import WorkCapacityModal from './workCapacity-modal';

export type WorkCenterMaintainTableProps = {
  form: UseFormReturn<WorkCenterFormData>;
};
/**
 *
 * @param form Main work center page form
 * @returns A table component filled with work capacities or allowed operations. The activeTableGroup state
 * controls which group is rendered. It is passed down to {@link useWorkCenterTableSetup} hook.
 *
 */
const WorkCenterMaintainTable = ({ form }: WorkCenterMaintainTableProps): JSX.Element => {
  const [activeTableGroup, setActiveTableGroup] = useState(true);
  const { translate } = useTranslate({ ns: 'workCenters', keyPrefix: 'maintain' });
  const [workCapacity, setWorkCapacity] = useState<WorkCapacityMapped>();

  const onEditWorkCapacity: (
    selectedWorkCapacity: WorkCapacityMapped | AllowedOperationMapped,
  ) => void = useCallback((selectedWorkCapacity: WorkCapacityMapped | AllowedOperationMapped) => {
    setWorkCapacity(selectedWorkCapacity as WorkCapacityMapped);
  }, []);

  const onClose = useCallback(() => setWorkCapacity(undefined), []);

  const table = useWorkCenterTableSetup({
    activeGroup: activeTableGroup,
    translate: translate,
    onEdit: onEditWorkCapacity,
  });
  const { allowedOperationsModal, openAllowedOperationsModal } = useAllowedOperationsModal({
    form,
  });

  return (
    <div className='table'>
      <div className='table-buttons'>
        <div className='table-tabs'>
          <div className='join-buttons'>
            <CustomButton
              color={activeTableGroup ? 'orange' : 'gray'}
              type='button'
              onClick={(): void => setActiveTableGroup(true)}
            >
              <div className='button-children'>
                <span>{translate('work_capacities')}</span>
              </div>
            </CustomButton>
            <CustomButton
              color={activeTableGroup ? 'gray' : 'orange'}
              type='button'
              onClick={(): void => setActiveTableGroup(false)}
            >
              <div className='button-children'>
                <span>{translate('allowed_operations')}</span>
              </div>
            </CustomButton>
          </div>
          <CustomButton
            color='blue'
            type='button'
            isDisabled={activeTableGroup}
            onClick={openAllowedOperationsModal}
          >
            <div className='button-children'>
              <img src={plus} alt='' />
              <span>{translate('add_operation')}</span>
            </div>
          </CustomButton>
        </div>
      </div>
      {table}
      {allowedOperationsModal}
      <WorkCapacityModal onClose={onClose} workCapacity={workCapacity} />
    </div>
  );
};

export default WorkCenterMaintainTable;
