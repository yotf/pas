/**
 * @module MaterialsForm
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter, limitNumberOfChars, nameofFactory } from '@/modules/shared/utils/utils';
import { FC, useContext } from 'react';
import {
  MaintainContext,
  MaintainContextValue,
} from '../../components/maintain/contexts/maintain.context';
import {
  Material,
  MaterialFormData,
  MaterialResponse,
} from '../settings/redux/materials/interfaces';
import { useMaterialsOptions } from './hooks/useMaterialsOptions';
/**
 * @returns Materials Form component with {@link Input | inputs} connected to the form returned by {@link UseMaterialsForm} hook.
 */
const MaterialsForm: FC = () => {
  const {
    ns,
    state: { entity },
    copying,
  } = useContext<MaintainContextValue<Material, MaterialResponse, MaterialFormData>>(
    MaintainContext,
  );
  const { translate } = useTranslate({ ns });

  const nameof = nameofFactory<MaterialFormData>();
  const {
    unit1Options,
    unit2Options,
    articleOptions,
    colorOptions,
    materialGroupOptions,
    routingOptions,
    selectionOptions,
    sizeRangeOptions,
    thicknessOptions,
    featureOptions,
  } = useMaterialsOptions();

  return (
    <form
      className='materials-form'
      data-testid='materials-form'
      autoComplete='off'
      onSubmit={(e): void => e.preventDefault()}
    >
      <div className='material-id'>
        <div>
          {!!entity?.id && (
            <CustomInput type='readonly' label={translate('id')} name={nameof('id')} />
          )}
        </div>
        <CustomSwitch label={translate('active')} name={nameof('isActive')} />
      </div>
      {!copying && !!entity?.id && (
        <>
          <CustomInput
            type='readonly'
            label={translate('createdOn')}
            value={dateFormatter(entity?.changeHistoryDto?.createdOn ?? String(new Date()))}
          />
        </>
      )}
      <div className='end'>
        <CustomInput
          type='text'
          label={translate('interfaceCode')}
          name={nameof('interfaceCode')}
          width='full-width'
          onKeyDownEvent={(e) => limitNumberOfChars(e, 25)}
        />
      </div>
      <div className='start stretch'>
        <CustomInput
          type='text'
          label={translate('name')}
          isRequired={true}
          name={nameof('name')}
          width='full-width'
          onKeyDownEvent={(e) => limitNumberOfChars(e, 30)}
        />
      </div>
      <div className='stretch'>
        <CustomInput
          type='select'
          label={translate('materialGroupId')}
          isRequired={true}
          name={nameof('materialGroupId')}
          options={materialGroupOptions}
          width='full-width'
          isAutocomplete={true}
        />
      </div>
      <CustomInput
        type='select'
        isRequired={true}
        label={translate('unitOfMeasure1Id')}
        name={nameof('unitOfMeasure1Id')}
        options={unit1Options}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='select'
        isRequired={true}
        label={translate('unitOfMeasure2Id')}
        name={nameof('unitOfMeasure2Id')}
        options={unit2Options}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='number'
        label={translate('factorAreaToKG')}
        name={nameof('factorAreaToKG')}
        width='full-width'
      />
      <CustomInput
        type='number'
        label={translate('factorAreaToPC')}
        name={nameof('factorAreaToPc')}
        width='full-width'
      />

      <CustomInput
        type='select'
        label={translate('articleId')}
        name={nameof('articleId')}
        options={articleOptions}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='select'
        label={translate('colorId')}
        name={nameof('colorId')}
        options={colorOptions}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='select'
        label={translate('thicknessId')}
        name={nameof('thicknessId')}
        options={thicknessOptions}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='select'
        label={translate('sizeRangeId')}
        name={nameof('sizeRangeId')}
        options={sizeRangeOptions}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='select'
        label={translate('selectionId')}
        name={nameof('selectionId')}
        options={selectionOptions}
        width='full-width'
        isAutocomplete={true}
      />
      <CustomInput
        type='select'
        label={translate('feature_description')}
        name={nameof('featureId')}
        width='full-width'
        options={featureOptions}
        isAutocomplete={true}
      />
      <div className='stretch'>
        <CustomInput
          type='select'
          label={translate('routingId')}
          name={nameof('routingId')}
          options={routingOptions}
          width='full-width'
          isAutocomplete={true}
        />
      </div>
    </form>
  );
};

export default MaterialsForm;
