/**
 * @module RoutingsForm
 */

import { FC, useContext } from 'react';
import CustomInput from '../../../shared/components/input/input.component';
import CustomSwitch from '../../../shared/components/input/switch/switch.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import {
  dateFormatter,
  limitNumberOfChars,
  limitToNumericKeyDown,
  nameofFactory,
} from '../../../shared/utils/utils';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import { Routing, RoutingFormData, RoutingResponse } from '../settings/redux/routings/interfaces';
import { useRoutingOptions } from './hooks/useRoutingOptions';
import RoutesTable from './routes-table';
import './routings-form.scss';
import dayjs from 'dayjs';
/**
 * @returns Materials Form component with {@link Input | inputs} connected to the form returned by {@link useRoutingForm} hook.
 */
const RoutingsForm: FC = () => {
  const {
    ns,
    state: { entity },
    copying,
  } = useContext<MaintainContextValue<Routing, RoutingResponse, RoutingFormData>>(MaintainContext);
  const { translate } = useTranslate({ ns });

  const nameof = nameofFactory<RoutingFormData>();
  const { customerOptions, materialOptions, unitOptions } = useRoutingOptions(entity);

  const preventDecimal = (
    event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (event.key === '.' || event.key.toLowerCase() === 'e') event.preventDefault();
  };

  return (
    <form
      className={'routings-form ' + (!entity?.id ? ' new' : '')}
      data-testid='routings-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      {(!copying && !!entity?.id && (
        <div className='routingId'>
          <CustomInput
            type='readonly'
            //  label={translate('routing_id')}
            name={nameof('routing_Id')}
          />
        </div>
      )) ||
        ''}

      <CustomInput
        type='readonly'
        label={translate('createdOn')}
        value={
          !copying && !!entity?.id
            ? dateFormatter(entity.changeHistoryDto.createdOn)
            : dateFormatter(dayjs().format())
        }
      />

      <div className='active '>
        <CustomSwitch label={translate('active')} name={nameof('isActive')} />
      </div>
      <CustomInput
        type='text'
        label={translate('routingInterfaceId')}
        name={nameof('routingInterfaceId')}
        maxLength={14}
        width='full-width'
      />
      <div className='routingName'>
        <CustomInput
          type='text'
          isRequired={true}
          label={translate('name')}
          name={nameof('name')}
          width='full-width'
          maxLength={30}
        />
      </div>

      {!copying && !!entity?.id && (
        <CustomInput
          type='readonly'
          label={translate('createdBy')}
          value={entity.changeHistoryDto.createdBy}
        />
      )}
      <div className='material'>
        <CustomInput
          type='select'
          label={translate('materialId')}
          name={nameof('materialId')}
          options={materialOptions}
          width='full-width'
        />
      </div>
      <CustomInput
        type='select'
        label={translate('customerId')}
        name={nameof('customerId')}
        options={customerOptions}
        isAutocomplete={true}
        width='full-width'
      />
      <CustomInput
        type='tel'
        pattern='[0-9]*'
        isRequired={true}
        label={translate('lotStandardQuantity')}
        name={nameof('lotStandardQuantity')}
        maxLength={5}
        onKeyDownEvent={limitToNumericKeyDown}
        width='full-width'
      />

      <CustomInput
        type='select'
        label={translate('unitOfMeasureId')}
        name={nameof('unitOfMeasureId')}
        options={unitOptions}
        width='full-width'
      />

      {!copying && !!entity?.id && (
        <CustomInput
          type='readonly'
          label={translate('updatedBy')}
          value={entity.changeHistoryDto.updatedBy}
        />
      )}
      <div className='remark'>
        <CustomInput
          type='textarea'
          label={translate('remark')}
          name={nameof('remark')}
          width='full-width'
          height={'142px'}
          rows={5}
          onKeyDownEvent={(e) => limitNumberOfChars(e, 200)}
        />
      </div>

      <RoutesTable />
    </form>
  );
};

export default RoutingsForm;
