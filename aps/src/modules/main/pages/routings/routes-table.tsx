/**
 * @module RoutesTable
 */

import plusIcon from '@/assets/plus.png';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import CustomButton from '../../../shared/components/button/button.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { MaintainContext } from '../../components/maintain/contexts/maintain.context';
import { RoutingFormData, RoutingRouteFormData } from '../settings/redux/routings/interfaces';
import { useRoutesTable } from './hooks/useRoutesTable';
import RoutesModal from './routes-modal';
import './routes-table.scss';
/**
 *
 * @returns Table rendered by {@link useRoutesTable} hook. The onEdit function chooses a routing route which opens {@link RoutesModal | routes modal} for editing
 * routing routes. The on delete function remove a routing route from the array which is contained in the main form (form from {@link useRoutingForm}).
 */

export interface Props {
  useActions?: boolean;
  isPlannedPO?: boolean;
  linkedPOId?: number;
  executeOperationCallback?: () => void;
}

const RoutesTable: React.FC<Props> = ({
  useActions = true,
  isPlannedPO,
  linkedPOId,
  executeOperationCallback,
}) => {
  const { ns } = useContext(MaintainContext);
  const { translate } = useTranslate({ ns, keyPrefix: 'routes' });
  const { getValues, setValue, watch } = useFormContext<RoutingFormData>();
  const [route, setRoute] = useState<RoutingRouteFormData>();
  const onClose = useCallback(() => setRoute(undefined), []);
  const [option, setOption] = useState<'create' | 'edit' | 'execute'>();
  const { routingAddAndUpdateOperations } = watch();
  const onAddOperation = useCallback(() => {
    setRoute({
      id: 0,
      guid: uuid(),
      remark: '',
      planning: true,
      leadTime: undefined,
    });
    setOption('create');
  }, []);
  const onEditOperation = useCallback(
    (selectedRoute: RoutingRouteFormData) => {
      setRoute(selectedRoute);
      isPlannedPO ? setOption('execute') : setOption('edit');
    },
    [isPlannedPO],
  );

  const totalLeadTime = useMemo(
    () =>
      routingAddAndUpdateOperations?.reduce(
        (total, obj) => total + (obj?.leadTime ? obj?.leadTime : 0),
        0,
      ),
    [routingAddAndUpdateOperations],
  );
  const onDeleteOperation = useCallback(
    (selectedRoute: RoutingRouteFormData) => {
      const routingOperations = getValues().routingAddAndUpdateOperations ?? [];
      routingOperations.splice(selectedRoute.sequence! - 1, 1);
      setValue('routingAddAndUpdateOperations', routingOperations, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );
  const table = useRoutesTable({
    onEdit: onEditOperation,
    onDelete: onDeleteOperation,
    useActions,
    isPlannedPO,
  });

  return (
    <div className='routes'>
      <div className='routes-header'>
        <div className='routes-info'>
          <div className='titles'>
            <h1>{translate('title')}</h1>
            <span className='subtitle'>{translate('subtitle')}</span>
          </div>
          <div className='total-lead'>
            {translate('total_lead_time')}
            {'  '}:{' ' + totalLeadTime}
          </div>
        </div>

        <div className='buttons'>
          <CustomButton
            type='button'
            color='blue'
            onClick={onAddOperation}
            isDisabled={!useActions}
          >
            <div className='button-children'>
              <img src={plusIcon} alt='' />
              <span>{translate('add_operation')}</span>
            </div>
          </CustomButton>
        </div>
      </div>
      {table}
      <RoutesModal
        onClose={onClose}
        route={route}
        option={option}
        linkedPOId={linkedPOId}
        executeOperationCallback={executeOperationCallback}
      />
    </div>
  );
};

export default RoutesTable;
