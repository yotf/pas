/**
 * @module RoutingsForm
 */

import { FC, useContext } from 'react';
import CustomInput from '../../../shared/components/input/input.component';
import CustomSwitch from '../../../shared/components/input/switch/switch.component';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { dateFormatter, nameofFactory } from '../../../shared/utils/utils';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import { Routing, RoutingFormData, RoutingResponse } from '../settings/redux/routings/interfaces';
import { useRoutingOptions } from './hooks/useRoutingOptions';
import RoutesTable from './routes-table';
import './routings-form.scss';
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
  const { customerOptions, materialOptions, unitOptions } = useRoutingOptions();

  const preventDecimal = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === '.' || event.key.toLowerCase() === 'e') event.preventDefault();
  };

  return (
    <form
      className='routings-form'
      data-testid='routings-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      {!copying && !!entity?.id && (
        <CustomInput type='readonly' label={translate('routing_id')} name={nameof('routing_Id')} />
      )}
      <CustomInput
        type='text'
        label={translate('routingInterfaceId')}
        name={nameof('routingInterfaceId')}
      />
      {!copying && !!entity?.id && (
        <>
          <CustomInput
            type='readonly'
            label={translate('createdOn')}
            value={dateFormatter(entity.changeHistoryDto.createdOn)}
          />
          <CustomInput
            type='readonly'
            label={translate('createdBy')}
            value={entity.changeHistoryDto.createdBy}
          />
          <CustomInput
            type='readonly'
            label={translate('updatedBy')}
            value={entity.changeHistoryDto.updatedBy}
          />
        </>
      )}
      <div className='active break'>
        <CustomSwitch label={translate('active')} name={nameof('isActive')} />
      </div>
      <div className='routingName'>
        <CustomInput
          type='text'
          isRequired={true}
          label={translate('name')}
          name={nameof('name')}
          width='full-width'
        />
      </div>
      <CustomInput
        type='select'
        label={translate('materialId')}
        name={nameof('materialId')}
        options={materialOptions}
      />
      <CustomInput
        type='select'
        label={translate('customerId')}
        name={nameof('customerId')}
        options={customerOptions}
        isAutocomplete={true}
      />
      <CustomInput
        type='number'
        isRequired={true}
        label={translate('lotStandardQuantity')}
        name={nameof('lotStandardQuantity')}
        onKeyDownEvent={preventDecimal}
      />
      <div className='remark'>
        <CustomInput
          type='textarea'
          label={translate('remark')}
          name={nameof('remark')}
          width='full-width'
          height={'142px'}
          rows={5}
        />
      </div>
      <div className='break'>
        <CustomInput
          type='select'
          label={translate('unitOfMeasureId')}
          name={nameof('unitOfMeasureId')}
          options={unitOptions}
        />
      </div>
      <RoutesTable />
    </form>
  );
};

export default RoutingsForm;
