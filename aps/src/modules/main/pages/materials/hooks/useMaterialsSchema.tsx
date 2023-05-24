/**
 * @module UseMaterialsSchema
 */

import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { MaterialFormData } from '../../settings/redux/materials/interfaces';

type EntityShape = Shape<MaterialFormData>;
/**
 *  Schema used for Material Form Data. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useMaterialsSchema = (): OptionalObjectSchema<
  EntityShape,
  AnyObject,
  TypeOfShape<EntityShape>
> => {
  const { translate } = useTranslate({
    ns: 'materials',
    keyPrefix: 'validation',
  });
  const numberNotRequired = useMemo(
    () =>
      Yup.number()
        .notRequired()
        .transform((val) => val || undefined),
    [],
  );

  const numberRequired = useMemo(
    () =>
      Yup.number()
        .required(translate('required'))
        .transform((val) => val || undefined),
    [translate],
  );
  const schema = useMemo(
    () =>
      Yup.object<Shape<Required<MaterialFormData>>>({
        id: numberNotRequired,
        articleId: numberNotRequired,
        colorId: numberNotRequired,
        factorAreaToKG: numberNotRequired,
        factorAreaToPc: numberNotRequired,
        interfaceCode: Yup.string()
          .notRequired()
          .max(25, translate('max_length', { name: '25' })),
        isActive: Yup.boolean(),
        materialGroupId: numberRequired,
        name: Yup.string()
          .required(translate('required'))
          .max(30, translate('max_length', { name: '30' })),
        routingId: numberNotRequired,
        unitOfMeasure1Id: numberRequired,
        unitOfMeasure2Id: numberRequired,
        selectionId: numberNotRequired,
        thicknessId: numberNotRequired,
        sizeRangeId: numberNotRequired,
        featureId: numberNotRequired,
      }),
    [numberNotRequired, numberRequired, translate],
  );
  return schema;
};
