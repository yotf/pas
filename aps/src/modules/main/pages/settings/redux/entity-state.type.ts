/**@module EntityState */
import BaseResponse from '../../../../shared/services/interfaces';
import { ValidationError } from './validation-error.type';
/**
 * Used to select which state to use in generic components
 */
export interface EntityState<Entity, SingleEntity> extends BaseResponse {
  data: Entity[];
  filtered: Entity[];
  routing?: SingleEntity;
  validationErrors?: ValidationError[];
}
