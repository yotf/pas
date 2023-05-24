import { mockedSettingsItem } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { mockedRouting } from '../../routings/__test__/consts';
import { Material } from '../../settings/redux/materials/interfaces';

export const mockedMaterialsData: Material = {
  isActive: true,
  interfaceCode: 'INTERFACE_CODE',
  id: 4,
  name: 'asdf',
  changeHistoryDto: { createdBy: 'creator', createdOn: '2022-12-22T18:09:00' },
  article: mockedSettingsItem,
  articleId: 1,
  articles: null,
  color: mockedSettingsItem,
  colorId: 1,
  colors: null,
  factorAreaToKG: 1,
  factorAreaToPc: 1,
  materialGroup: mockedSettingsItem,
  materialGroupId: 1,
  materialGroups: null,
  routing: mockedRouting,
  routingId: 1,
  routings: null,
  selection: mockedSettingsItem,
  selectionId: 1,
  selections: null,
  sizeRange: mockedSettingsItem,
  sizeRangeId: 1,
  sizeRanges: null,
  thickness: mockedSettingsItem,
  thicknesses: null,
  thicknessId: 1,
  unitOfMeasure1: mockedSettingsItem,
  unitOfMeasure1Id: 1,
  unitOfMeasure2: mockedSettingsItem,
  unitOfMeasure2Id: 2,
  unitOfMeasures: null,
  features: mockedSettingsItem,
};

export const mockedMaterialsDatasData: Material[] = [
  mockedMaterialsData,
  { ...mockedMaterialsData, id: 2, name: 'new_material' },
];
