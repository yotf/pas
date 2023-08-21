/**
 * @module UseOperationSchema
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { Shape } from '@/modules/shared/yup/yup.schema';
import { useMemo } from 'react';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject, Message } from 'yup/lib/types';
import { OperationFormData } from '../../settings/redux/operations/interfaces';
import * as Yup from 'yup';

type UserShape = Shape<OperationFormData>;
/**
 *  Schema used for {@link OperationsForm}. Validates user inputs and renders errors in case the values don't match the Schema rules
 */
export const useOperationSchema = (): OptionalObjectSchema<
  UserShape,
  AnyObject,
  TypeOfShape<UserShape>
> => {
  const { translate } = useTranslate({
    ns: 'operations',
    keyPrefix: 'validation',
  });
  const requiredString = useMemo(() => Yup.string().required(translate('required')), [translate]);
  const nonRequiredNumber = useMemo(
    () =>
      Yup.number()
        .transform((value) => value || undefined)
        .moreThan(-1, translate('positive')),
    [translate],
  );
  const requiredNumber = useMemo(
    () => nonRequiredNumber.required(translate('required')),
    [nonRequiredNumber, translate],
  );

  const testTimeValidator = (_: number | undefined, context: Yup.TestContext): boolean => {
    const { originalValue } = context as Yup.TestContext<number | undefined> & {
      originalValue: number | undefined;
    };
    const convert = String(originalValue);
    if (convert) return convert.replace('.', '').length <= 7;
    return convert.length <= 4;
  };

  const notRequiredTimeValidator: {
    name: string;
    message: Message;
    test: Yup.TestFunction<number | undefined>;
  } = useMemo(
    () => ({
      name: 'length',
      message: translate('time_format', { name: '{xxxx,xxx}' }),
      test: testTimeValidator,
    }),
    [translate],
  );
  const timeValidator: {
    name: string;
    message: Message;
    test: Yup.TestFunction<number | undefined>;
  } = useMemo(
    () => ({
      name: 'length',
      message: translate('time_format', { name: '{xxxx,xxx}' }),
      test: testTimeValidator,
    }),
    [translate],
  );
  const requiredNumberShort = useMemo(
    () => requiredNumber.test(timeValidator),
    [requiredNumber, timeValidator],
  );
  const nonRequiredNumberShort = useMemo(
    () => nonRequiredNumber.test(notRequiredTimeValidator),
    [nonRequiredNumber, notRequiredTimeValidator],
  );
  const allocationBasedName: keyof OperationFormData = 'allocationBased';

  const schema = useMemo(
    () =>
      Yup.object<Shape<OperationFormData>>({
        id: Yup.number().notRequired(),
        name: requiredString.max(30, translate('max_length', { name: '30' })),
        operation_Id: nonRequiredNumber,
        departmentId: nonRequiredNumber,
        allocationBased: Yup.number(),
        isActive: Yup.boolean().default(true),
        remark: Yup.string().max(200, translate('max_length', { name: '200' })),
        unitOfMeasureId: nonRequiredNumber.when(allocationBasedName, {
          is: 3,
          then: (unitSchema) => unitSchema.notRequired(),
          otherwise: (unitSchema) => unitSchema.required(translate('required')),
        }),
        operationTime: requiredNumberShort,
        setupTime: nonRequiredNumberShort,
        waitingTime: nonRequiredNumberShort,
        interfaceCode: Yup.string().max(20, translate('max_length', { name: '20' })),
      }),
    [nonRequiredNumber, nonRequiredNumberShort, requiredNumberShort, requiredString, translate],
  );
  return schema;
};
