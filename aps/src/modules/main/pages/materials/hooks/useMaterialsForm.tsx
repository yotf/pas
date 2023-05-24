/**
 * @module UseMaterialsForm
 */

import { useCallback, useMemo } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { useMaintainForm } from '../../../components/maintain/hooks/useMaintainForm';
import {
  MaterialFormData,
  MaterialResponse,
  MaterialsResponse,
} from '../../settings/redux/materials/interfaces';
import { clearMaterials } from '../../settings/redux/materials/slice';
import { getMaterial } from '../../settings/redux/materials/thunks';
import { useMaterialsSchema } from './useMaterialsSchema';

export type UseMaterialsSettingsFormType = {
  copy?: boolean;
  state: MaterialsResponse;
};
/**
 * @param copy If copy is true values are copied from an already created Material and placed inside the form.
 * Creates a mapping function and a indicates which fields cannot be duplicated. Creates a validation schema using {@link UseMaterialsSchema}.
 * Mentioned values are passed down to {@link useMaintainForm}.
 * @returns A form created by {@link useMaintainForm}.
 */
export const useMaterialsForm = ({
  copy,
  state,
}: UseMaterialsSettingsFormType): UseFormReturn<MaterialFormData, any> => {
  const validationSchema = useMaterialsSchema();
  const duplicateErrors: Record<string, Path<MaterialFormData>> = useMemo(
    () => ({
      DuplicateMaterialName: 'name',
    }),
    [],
  );

  const mapEntityToFormData: (entity?: MaterialResponse) => MaterialFormData = useCallback(
    (entity) =>
      !entity || entity?.id === 0
        ? {
            id: 0,
            name: '',
            isActive: true,
            interfaceCode: '',
            factorAreaToKG: '',
            factorAreaToPc: '',
            materialGroupId: undefined,
            unitOfMeasure1Id: undefined,
            unitOfMeasure2Id: undefined,
            routingId: undefined,
            thicknessId: undefined,
            articleId: undefined,
            colorId: undefined,
            sizeRangeId: undefined,
            selectionId: undefined,
            featureId: undefined,
          }
        : {
            id: copy ? 0 : entity.id || 0,
            name: copy ? '' : entity.name || '',
            isActive: entity.isActive,
            interfaceCode: entity.interfaceCode,
            factorAreaToKG: entity.factorAreaToKG,
            factorAreaToPc: entity.factorAreaToPc,
            materialGroupId: entity.materialGroupId,
            unitOfMeasure1Id: entity.unitOfMeasure1Id,
            unitOfMeasure2Id: entity.unitOfMeasure2Id,
            routingId: entity.routingId,
            thicknessId: entity.thicknessId,
            articleId: entity.articleId,
            colorId: entity.colorId,
            sizeRangeId: entity.sizeRangeId,
            selectionId: entity.selectionId,
            featureId: entity.featureId ?? undefined,
          },
    [copy],
  );
  const form = useMaintainForm({
    ns: 'materials',
    validationSchema,
    duplicateErrors,
    mapEntityToFormData,
    state,
    clearEntity: clearMaterials,
    readThunk: getMaterial,
  });

  return form;
};
