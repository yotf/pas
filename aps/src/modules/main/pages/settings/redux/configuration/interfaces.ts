import UnitsOfMeasure from '../../../unitOfMeasure/unitOfMeasure.page';
import { SettingsPageItem } from '../../consts/interfaces';

export interface Configuration {
  quantities1: UnitOfMeasure[];
  quantities2: UnitOfMeasure[];
  defaultKg?:  UnitOfMeasure;
}

// export interface PostConfiguration {
// quantities1: [];
// quantities2: [];
// defaultKg: UnitOfMeasure;
// }

export interface UnitOfMeasure {
  unitOfMeasureId: number;
  unitOfMeasure?: SettingsPageItem;
}
