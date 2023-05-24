/**
 * @module UseEntityForm
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { Shape } from '../../../../shared/yup/yup.schema';

export type UseEntityFormProps<T> = {
  entity: T;
  validationSchema: OptionalObjectSchema<Shape<T>, AnyObject, TypeOfShape<Shape<T>>>;
  isOpen: boolean;
};
/**
 * @template T Type of data used for form creation and validation
 * @param entity Type T entity used to reset the form
 * @param validationSchema Yup schema used for form validation
 * @param isOpen to be deleted?
 * @returns A form with validation schema attached
 */
export const useEntityForm = <T extends FieldValues>({
  entity,
  validationSchema,
  isOpen,
}: UseEntityFormProps<T>): UseFormReturn<T, any> => {
  const form = useForm<T>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  useEffect(() => {
    form.reset(entity);
  }, [form, entity, isOpen]);
  return form;
};
