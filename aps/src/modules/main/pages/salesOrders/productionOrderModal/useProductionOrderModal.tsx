/**
 * @module useProductionOrderModal
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { getAllMaterials } from '../../settings/redux/materials/thunks';
import { ProductionOrderModalForm } from '../../settings/redux/productionOrders/productionOrdersModal/interfaces';
import { createProductionOrdersFromSalesOrder } from '../../settings/redux/productionOrders/productionOrdersModal/thunks';
import { SalesMaterialFormData } from '../../settings/redux/salesOrders/interfaces';
import POModalActions from './components/POModalActions';
import POModalInputs from './components/POModalInputs';
import SingleProductionOrder from './components/SingleProductionOrder';
import './productionOrderModal.scss';
import { usePOModalInitialValues } from './usePOModalInitialValues';
import { useProductionOrderModalSchema } from './useProductionOrderModalSchema';
import { usePOModalValidation } from './usePOModalValidation';
import { MaintainContext } from '@/modules/main/components/maintain/contexts/maintain.context';
import { getLinkedProductionOrders } from '../../settings/redux/productionOrders/productionOrdersLinkedOrders/thunks';
import { POSituation } from '@/modules/shared/consts';

export type UseRedirectModalReturnType = {
  modal: JSX.Element;
  openPOModal: (material: SalesMaterialFormData) => void;
};
/**
 *
 * @returns Production Order modal form and logic. Sets initial values of generated production orders based on user inputs and updates them using useFieldArray.
 */
export const useProductionOrderModal = (): UseRedirectModalReturnType => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<SalesMaterialFormData>();
  const { data: materials } = useAppSelector((state) => state.materials);
  const { data: linkedProductionOrders } = useAppSelector((state) => state.linkedProductionOrders);
  const dispatch = useAppDispatch();

  const ns = 'productionOrderModal';

  const { state } = useContext(MaintainContext);

  const { translate } = useTranslate({
    ns: ns,
  });

  const validationSchema = useProductionOrderModalSchema();
  const form = useForm<ProductionOrderModalForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
    watch,
    getValues,
  } = form;

  useEffect(() => {
    dispatch(getAllMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (selectedMaterial && selectedMaterial?.id)
      dispatch(
        getLinkedProductionOrders({
          salesOrderId: state.entity?.id,
          salesOrderMaterialId: selectedMaterial?.id,
        }),
      );
  }, [dispatch, selectedMaterial]);

  const { productionOrders } = watch();

  const { fields, remove } = useFieldArray({
    control,
    name: 'productionOrders',
    keyName: 'fieldId',
  });

  const clearPOModalForm = useCallback((): void => {
    reset({ productionOrders: [] }, { keepIsSubmitted: false, keepDefaultValues: false });
  }, [reset]);

  const closePOModal = useCallback((): void => {
    setIsOpen(false);
    clearPOModalForm();
  }, [clearPOModalForm]);

  const openPOModal = useCallback((material: SalesMaterialFormData | undefined): void => {
    setIsOpen(true);
    setSelectedMaterial(material);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(
      createProductionOrdersFromSalesOrder(
        data.productionOrders.map((po) => ({
          ...po,
          statusOfPlanningEnum: po.statusOfPlanningBoolean ? 2 : 1,
        })),
      ),
    );
    closePOModal();
  });

  const selectedMaterialFull = useMemo(
    () => materials.find((material) => selectedMaterial?.materialId === material.id),
    [materials, selectedMaterial?.materialId],
  );

  const productionOrderInitial = usePOModalInitialValues({
    form,
    selectedMaterial,
    selectedMaterialFull,
  });

  usePOModalValidation({ ns, form });

  const modal: JSX.Element = (
    <div>
      <Modal
        centered
        open={isOpen}
        okText={translate('ok_text')}
        onOk={onSubmit}
        okButtonProps={{ disabled: !isValid || !isDirty }}
        cancelText={translate('cancel')}
        onCancel={closePOModal}
        closable={true}
        title={translate('po_modal_title')}
        className='production-order-modal-wrapper'
        footer={null}
      >
        <FormProvider {...form}>
          <div className='production-order-modal'>
            <div className='material-info'>
              <h3>{selectedMaterial?.materialName}</h3>
              <POModalInputs ns={ns} productionOrderInitial={productionOrderInitial} />
              <POModalActions
                productionOrderInitial={productionOrderInitial}
                translate={translate}
              />
            </div>
            {productionOrders?.length ? (
              <div className='production-orders-labels'>
                <p>{translate('productionOrderQuantity')}</p>
                <p>{translate('schedule')}</p>
              </div>
            ) : (
              <div></div>
            )}
            <div className='production-orders-info'>
              {fields.map((field, index): JSX.Element => {
                return (
                  <SingleProductionOrder
                    key={field.fieldId}
                    index={index}
                    ns={ns}
                    factorAreaToPc={selectedMaterialFull?.factorAreaToPc}
                    remove={remove}
                  />
                );
              })}
            </div>
          </div>
          <div className='ant-modal-footer'>
            <div className='button-container'>
              <Button onClick={closePOModal} type='default'>
                {translate('cancel')}
              </Button>
              <Button type='primary' onClick={onSubmit} disabled={!isValid || !isDirty}>
                {translate('ok_text')}
              </Button>
            </div>
          </div>
          <div>
            <div className='linked-po-title'>{translate('linkedProductionOrders')}</div>
            <div className='linked-po-header'>
              <p>{translate('productionOrderNumber')}</p>
              <p>{translate('quantity1')}</p>
              <p>{translate('quantity2')}</p>
              <p>{translate('situation')}</p>
            </div>
            <div className='table-container'>
              {linkedProductionOrders
                ? linkedProductionOrders.map((po) => {
                    return (
                      <div className='modal-item' key={po.id}>
                        <div className='po-info'>
                          <p>{po.productionOrder_Id}</p>
                          <p>{po.quantity1}</p>
                          <p>{po.quantity2}</p>
                          <p>{POSituation[po.situationEnum]}</p>
                        </div>
                      </div>
                    );
                  })
                : ''}
            </div>
          </div>
        </FormProvider>
      </Modal>
    </div>
  );

  return { modal, openPOModal };
};
