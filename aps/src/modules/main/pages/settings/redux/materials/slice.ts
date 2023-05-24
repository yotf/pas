/**
 * @module MaterialSlice
 */
import { createEntitySlice } from '../slice';
import { Material, MaterialFormData, MaterialResponse } from './interfaces';
import { materialThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const materialsSlice = createEntitySlice<Material, MaterialResponse, MaterialFormData>(
  'materialsSlice',
  (entity) => [entity.name, entity.materialGroup?.name, entity.routing?.name],
  materialThunks,
);
export const { filterEntities: filterMaterials, clearEntity: clearMaterials } =
  materialsSlice.actions;
export const materialsReducer = materialsSlice.reducer;
