/**
 * @module MaterialInterfaces
 */

import { SettingsPageItem } from '../../consts/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { Routing } from '../routings/interfaces';
import { State } from '../slice';
/** Material recieved from backend */
export interface Material {
  id: number;
  name: string;
  isActive: boolean;
  article: SettingsPageItem;
  articleId: number;
  articles: SettingsPageItem[] | null;
  changeHistoryDto: ChangeHistoryDto;
  color: SettingsPageItem;
  colorId: number;
  colors: SettingsPageItem[] | null;
  factorAreaToKG: number;
  factorAreaToPc: number;
  interfaceCode: string;
  materialGroup: SettingsPageItem;
  materialGroupId: number;
  materialGroups: SettingsPageItem[] | null;
  routing: Routing;
  routings: Routing[] | null;
  routingId: number;
  selection: SettingsPageItem;
  selectionId: number;
  selections: SettingsPageItem[] | null;
  thickness: SettingsPageItem;
  thicknessId: number;
  thicknesses: SettingsPageItem[] | null;
  unitOfMeasure1: SettingsPageItem;
  unitOfMeasure1Id: number;
  unitOfMeasure2: SettingsPageItem;
  unitOfMeasure2Id: number;
  unitOfMeasures: SettingsPageItem[] | null;
  sizeRange: SettingsPageItem;
  sizeRangeId: number;
  sizeRanges: SettingsPageItem[] | null;
  features: SettingsPageItem;
  featureId?: number;
}
/**Used for editing and creating material */
export interface MaterialFormData {
  id?: number;
  name: string;
  isActive: boolean;
  interfaceCode: string;
  factorAreaToKG: number | string;
  factorAreaToPc?: number | string;
  materialGroupId?: number;
  unitOfMeasure1Id?: number;
  unitOfMeasure2Id?: number;
  routingId?: number;
  thicknessId?: number;
  articleId?: number;
  colorId?: number;
  sizeRangeId?: number;
  selectionId?: number;
  featureId?: number;
}
/** Used for table */
export interface MaterialMapped {
  id: number;
  materialId?: number;
  name: string;
  isActive: boolean;
  factorAreaToKG: number;
  factorAreaToPC: number;
  unitOfMeasure1Name: string;
  unitOfMeasure2Name: string;
  articleName: string;
  interfaceCode: string;
  colorName: string;
  thicknessName: string;
  sizeRangeName: string;
  featureName: string;
  selectionName: string;
  routingName: string;
  materialGroupName: string;
  createdOn: string;
}

export type MaterialResponse = Material;

export type MaterialsResponse = State<Material, MaterialResponse>;
