/**
 * @module useGeneratedSequence
 */

import { useEffect } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
/**Generates sequence for tables with sequence (e.g. {@link SalesOrderMaterialsTable}). When the user tries to edit or create a new entry in the table this hook enters the sequence value  */
export const useGeneratedSequence = <T extends { sequence?: number }, F extends object>(
  entity: T,
  form: UseFormReturn<T>,
  elements: keyof F,
): void => {
  const { getValues } = useFormContext<F>();

  const { setValue, reset } = form;

  for (const prop in entity) {
    if (entity[prop] === null) {
      entity[prop] = undefined as any;
    }
  }

  useEffect(() => {
    if (entity?.sequence) {
      reset(entity);
      return;
    }
    const { [elements]: arrays = [] } = getValues();
    const sequence = (arrays as []).length + 1;
    reset({
      ...entity,
      sequence,
    });
  }, [reset, getValues, entity, setValue, elements]);
};
