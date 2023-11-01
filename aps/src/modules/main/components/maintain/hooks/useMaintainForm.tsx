/**
 * @module useMaintainForm
 */

import { useAppDispatch } from '@/store/hooks';
import { ActionCreatorWithoutPayload, AsyncThunk } from '@reduxjs/toolkit';
import { useEffect, useMemo } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AnyObject, OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { Shape } from '../../../../shared/yup/yup.schema';
import { useEntityForm } from '../../../pages/settings/hooks/entity-form';
import { State } from '../../../pages/settings/redux/slice';
import { IdType } from '../../../pages/settings/redux/thunks';
import { useFormServerErrors } from './useFormServerErrors';

export type UseMaintainSetupProps<Entity, SingleEntity, FormData> = {
  ns: string;
  readThunk: AsyncThunk<Entity, IdType, Record<string, unknown>>;
  validationSchema: OptionalObjectSchema<Shape<FormData>, AnyObject, TypeOfShape<Shape<FormData>>>;
  duplicateErrors: Record<string, Path<FormData>>;
  state: State<Entity, SingleEntity>;
  mapEntityToFormData: (entity?: SingleEntity) => FormData;
  clearEntity: ActionCreatorWithoutPayload;
};
/**
 * @template Entity Entity recieved from the API
 * @template SingleEntity One entity recieved from the API or remapped and shown on the Maintain page inside the context.
 * @template FormData Data collected from user inputs and used to make API requests
 * Uses {@link UseEntityForm} for creating a form with values and validation. The {@link useFormServerErrorsHook} hook is used for validation errors.
 * @returns A form ready to be used on maintain pages. Initial data is fetched when entering a maintain page and cleared when leaving it using useEffect hooks.
 */
export const useMaintainForm = <Entity, SingleEntity, FormData extends FieldValues>({
  ns,
  duplicateErrors,
  validationSchema,
  readThunk,
  state,
  mapEntityToFormData,
  clearEntity,
}: UseMaintainSetupProps<Entity, SingleEntity, FormData>): UseFormReturn<FormData, any> => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { entity } = state;
  const editEntity = useMemo(() => mapEntityToFormData(entity), [entity, mapEntityToFormData]);

  useEffect(() => {
    if (!id) return;
    dispatch(readThunk(id));
  }, [dispatch, id, readThunk]);

  const form = useEntityForm({ entity: editEntity, validationSchema, isOpen: false });
  useFormServerErrors({ ns, form, duplicateErrors, state });

  useEffect(() => {
    return () => {
      dispatch(clearEntity());
    };
  }, [clearEntity, dispatch]);

  return form;
};
