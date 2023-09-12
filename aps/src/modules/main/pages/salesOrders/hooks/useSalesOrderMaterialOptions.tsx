import { useAppSelector } from '@/store/hooks';
import { DefaultOptionType } from 'antd/es/select';
import { SalesMaterial, SalesMaterialFormData } from '../../settings/redux/salesOrders/interfaces';
import { mapDataToOptions } from '@/modules/shared/utils/utils';
import { useMemo } from 'react';

export type UseSalesOrderMaterialOptionType = {
  materialOptions: DefaultOptionType[];
};

export const useSalesOrderMaterialOptions = (
  material?: SalesMaterialFormData,
): UseSalesOrderMaterialOptionType => {
  const { materials } = useAppSelector((state) => ({
    materials: state.materials.data,
  }));

  const materialOptions: DefaultOptionType[] = useMemo(() => {
    debugger;
    return mapDataToOptions(
      materials,
      material?.materialName
        ? { label: material.materialName, value: material.materialId! }
        : undefined,
    );
  }, [materials, material]);

  return { materialOptions };
};
