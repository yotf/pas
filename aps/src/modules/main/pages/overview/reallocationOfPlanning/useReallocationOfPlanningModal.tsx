/**
 * @module useReallocationOfPlanningModal
 */

import CustomButton from '@/modules/shared/components/button/button.component';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { nameofFactory } from '@/modules/shared/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { OverviewProductionOrderOperationMapped } from '../../settings/redux/overview/interfaces';
import {
  getAllProductionOrders,
  getProductionOrder,
} from '../../settings/redux/productionOrders/thunks';
import { ReallocationOfPlanningForm } from '../../settings/redux/reallocationOfPlanning/interfaces';
import { ConfirmationModal } from './hooks/ConfirmationModal';
import { useReallocationValidation } from './hooks/useReallocationOfPlanningValidation';
import { ReallocationTable } from './hooks/ReallocationTable';
import { mockedReallocationOperations } from './mockedReallocationData';
import './reallocationOfPlanning.scss';
import { useReallocationOfPlanningSchema } from './useReallocationOfPlanningSchema';
import { Modal } from 'antd';

export type UseRedirectModalReturnType = {
  reallocationModal: JSX.Element;
  openReallocationModal: (selectedOperation: OverviewProductionOrderOperationMapped) => void;
};
/**
 *
 * @returns Reallocation of planning modal with form, form validation and function for opening it
 */
export const useReallocationOfPlanningModal = (): UseRedirectModalReturnType => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const { data, loading, entity } = useAppSelector((state) => state.productionOrders);

  const [selectedPOId, setSelectedPOid] = useState<number>();
  const dispatch = useAppDispatch();

  const { translate } = useTranslate({
    ns: 'reallocationOfPlanning',
  });

  useEffect(() => {
    if (!data.length) {
      dispatch(getAllProductionOrders());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedProductionOrder = useMemo(() => {
    return data.find((po) => po.id === selectedPOId);
  }, [data, selectedPOId]);

  useEffect(() => {
    dispatch(getProductionOrder(selectedPOId));
  }, [selectedProductionOrder]);

  const closeModal = useCallback((): void => {
    setIsOpen(false);
  }, []);
  const openReallocationModal = useCallback(
    (selectedOperation: OverviewProductionOrderOperationMapped): void => {
      setIsOpen(true);
      setSelectedPOid(selectedOperation.id);
    },
    [],
  );

  const handleOk = useCallback((): void => {
    closeModal();
  }, [closeModal]);

  const validationSchema = useReallocationOfPlanningSchema();
  const form = useForm<ReallocationOfPlanningForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const {
    setValue,
    watch,
    formState: { isValid },
  } = form;

  const { productionOrderDelivery, salesOrderDelivery } = watch();

  const nameof = nameofFactory<ReallocationOfPlanningForm>();

  useEffect(() => {
    debugger;
    setValue('productionOrderNumber', selectedProductionOrder?.id ?? 0);
    setValue('productionOrderDelivery', selectedProductionOrder?.foreseenDelivery || '');
    setValue('salesOrderDelivery', selectedProductionOrder?.salesOrderDto.salesOrderDelivery || '');
    setValue('reallocationOperations', entity?.pO_RoutingOperations);
  }, [selectedProductionOrder, setValue, entity?.pO_RoutingOperations]);

  const activePO = useMemo(
    () =>
      selectedProductionOrder?.finalDelivery ||
      selectedProductionOrder?.salesOrderDto.salesOrderDelivery,
    [selectedProductionOrder],
  );

  useReallocationValidation(form);

  const reallocationModal: JSX.Element = (
    <Modal
      centered
      open={isOpen}
      okText={translate('ok_text')}
      onOk={handleOk}
      cancelText={translate('cancel')}
      onCancel={closeModal}
      closable={true}
      title={translate('title')}
    >
      {loading ? (
        <div className='reallocation-of-planning'>Loading...</div>
      ) : (
        <FormProvider {...form}>
          <div className='reallocation-of-planning'>
            <div className='reallocation-inputs'>
              <CustomInput
                type='text'
                label={translate('productionOrderNumber')}
                name={nameof('productionOrderNumber')}
                disabled={true}
              />
              <CustomInput
                type='date'
                label={translate('productionOrderDelivery')}
                name={nameof('productionOrderDelivery')}
                disabled={true}
              />

              <CustomInput
                type='date'
                label={translate('salesOrderDelivery')}
                name={nameof('salesOrderDelivery')}
                disabled={true}
              />
              <div
                className={`indicator ${
                  activePO &&
                  (dayjs(productionOrderDelivery).isBefore(dayjs(salesOrderDelivery))
                    ? 'green-indicator'
                    : 'red-indicator')
                }`}
              ></div>
              <CustomButton
                color='white'
                type='button'
                onClick={(): void => setIsConfirmModalOpen(true)}
                isDisabled={!isValid}
              >
                <>
                  {translate(
                    selectedProductionOrder?.statusOfPlanningEnum === 1 ? 'unschedule' : 'schedule',
                  )}
                </>
              </CustomButton>
            </div>
          </div>
          <div className='table-wrapper'>
            <ReallocationTable />
          </div>
          <ConfirmationModal open={isConfirmModalOpen} setIsOpen={setIsConfirmModalOpen} />
        </FormProvider>
      )}
    </Modal>
  );

  return { reallocationModal, openReallocationModal };
};
