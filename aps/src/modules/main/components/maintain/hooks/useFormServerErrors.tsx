/**
 * @module useFormServerErrorsHook
 */

import { useEffect, useMemo, useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslate } from '../../../../shared/hooks/translate.hook';
import { State } from '../../../pages/settings/redux/slice';

/**
 * @template Entity Entity recieved from the API
 * @template SingleEntity One entity recieved from the API or remapped and shown on the Maintain page inside the context.
 * @template FormData Data collected from user inputs and used to make API requests
 */
export type UseFormServerErrorsProps<Entity, SingleEntity, FormData extends FieldValues> = {
  /** Localization Namespace */
  ns: string;
  /** RHF form with methods and callback */
  form: UseFormReturn<FormData, any>;
  /** Object containing fields that can have duplicate error messages */
  duplicateErrors: Record<string, Path<FormData>>;
  /** Redux state from which data is extracted */
  state: State<Entity, SingleEntity>;
};

interface LastFailed {
  [key: string]: {
    prevValue: string;
    error?: {
      type: string;
      message: string;
    };
  };
}
/**
 * @template Entity Entity recieved from the API
 * @template SingleEntity One entity recieved from the API or remapped and shown on the Maintain page inside the context.
 * @template FormData Data collected from user inputs and used to make API requests
 * @returns A form of FormData type. Checks if any validation errors occured and renders them on page
 */
export const useFormServerErrors = <Entity, SingleEntity, FormData extends FieldValues>({
  ns,
  form,
  duplicateErrors,
  state,
}: UseFormServerErrorsProps<Entity, SingleEntity, FormData>): UseFormReturn<FormData, any> => {
  const { validationErrors, loading } = state;
  const { translate } = useTranslate({
    ns,
    keyPrefix: 'validation',
  });
  const {
    clearErrors,
    setError,
    formState: { errors },
  } = form;

  const formValues = form.watch();
  const uniqueFields = useMemo(() => Object.values(duplicateErrors), [duplicateErrors]);
  const [lastFailedValues, setLastFailedValues] = useState<LastFailed>({});

  useEffect(() => {
    uniqueFields.forEach((field) => {
      if (
        !errors[field] &&
        lastFailedValues[field] != undefined &&
        lastFailedValues[field]?.prevValue === formValues[field]
      ) {
        const err = lastFailedValues[field].error;
        if (err) setError(field, err);
      }

      if (
        lastFailedValues[field] !== undefined &&
        errors[field] === lastFailedValues[field]?.error &&
        lastFailedValues[field]?.prevValue !== formValues[field]
      ) {
        clearErrors(field);
      }
    });
  }, [clearErrors, duplicateErrors, lastFailedValues, setError, uniqueFields, errors, formValues]);

  useEffect(() => {
    if (!validationErrors) return;
    if (!Array.isArray(validationErrors)) {
      const duplicateErrorName = Object.keys(duplicateErrors)[0];
      const duplicateErrorProperty = duplicateErrors[duplicateErrorName];
      setLastFailedValues({
        [duplicateErrorProperty]: {
          prevValue: formValues[duplicateErrorProperty],
          error: {
            type: duplicateErrorName,
            message: translate(duplicateErrorName),
          },
        },
      });
    } else {
      validationErrors.forEach(({ code }) =>
        setLastFailedValues({
          [duplicateErrors[code]]: {
            prevValue: formValues[duplicateErrors[code]],
            error: {
              type: code,
              message: translate(code),
            },
          },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationErrors, setError, duplicateErrors, translate]);

  useEffect(() => {
    return () => {
      setLastFailedValues({});
    };
  }, [loading]);
  return form;
};
