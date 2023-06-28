/**
 * @module MaintainActions
 */

import copyBlack from '@/assets/icons/copy black.svg';
import save from '@/assets/icons/save.svg';
import trash from '@/assets/icons/trash-2.svg';
import CustomButton from '@/modules/shared/components/button/button.component';
import { useContext, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { MaintainContext } from './contexts/maintain.context';
import useMaintainActions from './hooks/useMaintainActions';
import { POFormStatus } from '@/modules/shared/consts';

export type MaintainActionProps = {
  copy?: boolean;
};
/**
 *
 * @param copy If false, shown entity is not copied and a copy button will be rendered
 * @returns Header of maintain pages. Entity values used are extracted from {@link MaintainContext}. Actions are returned from the {@link useMaintainActions} hook.
 */
const MaintainActions = ({ copy }: MaintainActionProps): JSX.Element => {
  const { onCopyClick, onDeleteClick, onSubmit } = useMaintainActions(copy);
  const { translate } = useTranslate({ ns: 'maintain-header' });
  const {
    copying,
    state: { entity },
    ns,
  } = useContext(MaintainContext);
  const {
    formState: { isDirty, isValid },
    watch,
  } = useFormContext();

  const status = useMemo(() => entity?.status, [entity?.status]);

  const shouldDelete = useMemo(() => {
    return entity?.isActive || (status === undefined ? true : status === 3);
  }, [entity?.isActive, status]);

  const { statusOfPlanningEnum } = watch();

  const isPlannedProductionOrder = useMemo(
    () =>
      ns === 'productionOrder' &&
      !!entity?.id &&
      //     (entity?.statusOfPlanningEnum === POFormStatus.planned &&
      statusOfPlanningEnum === POFormStatus.planned,
    [(entity?.id, entity?.statusOfPlanningEnum), statusOfPlanningEnum],
  );

  return (
    <div className='maintain-actions'>
      {onCopyClick && !!entity?.id && !copying && (
        <CustomButton customClass='action-button' color='gray' type='button' onClick={onCopyClick}>
          <div className='button-children'>
            <img src={copyBlack} alt='' />
            <span>{translate('copy')}</span>
          </div>
        </CustomButton>
      )}
      <CustomButton
        customClass='action-button'
        color='blue'
        type='button'
        isDisabled={!isDirty || !isValid || isPlannedProductionOrder}
        onClick={onSubmit}
      >
        <div className='button-children'>
          <img src={save} alt='' />
          <span>{translate('save')}</span>
        </div>
      </CustomButton>
      {!!entity?.id && (
        <CustomButton
          customClass='action-button'
          color='red'
          type='button'
          isDisabled={entity?.isActive || !shouldDelete || isPlannedProductionOrder}
          onClick={onDeleteClick}
        >
          <div className='button-children'>
            <img src={trash} alt='' />
            <span>{translate('delete')}</span>
          </div>
        </CustomButton>
      )}
    </div>
  );
};

export default MaintainActions;
