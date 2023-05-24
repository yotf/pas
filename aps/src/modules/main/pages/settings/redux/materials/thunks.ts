/**
 * @module MaterialsThunks
 */

import { createCrudThunks } from '../thunks';
import { BASE_MATERIALS_API } from './../../consts/apiUrl';
import { Material, MaterialFormData, MaterialResponse } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link MaterialSlice}
 */
export const materialThunks = createCrudThunks<Material, MaterialResponse, MaterialFormData>(
  BASE_MATERIALS_API,
);
export const {
  listThunk: getAllMaterials,
  readThunk: getMaterial,
  upsertThunk: upsertMaterial,
  deleteThunk: deleteMaterial,
} = materialThunks;
