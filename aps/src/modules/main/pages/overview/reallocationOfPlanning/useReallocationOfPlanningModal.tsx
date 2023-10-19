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
import { getProductionOrder } from '../../settings/redux/productionOrders/thunks';
import { ReallocationOfPlanningForm } from '../../settings/redux/overview/reallocationOfPlanning/interfaces';
import { ConfirmationModal } from './hooks/ConfirmationModal';
import { useReallocationValidation } from './hooks/useReallocationOfPlanningValidation';
import { ReallocationTable } from './hooks/ReallocationTable';
import { mockedReallocationOperations } from './mockedReallocationData';
import './reallocationOfPlanning.scss';
import { useReallocationOfPlanningSchema } from './useReallocationOfPlanningSchema';
import { Modal } from 'antd';
import CustomSwitch from '@/modules/shared/components/input/switch/switch.component';
import { ReallocationConfirmationModal } from './hooks/ReallocationConfirmationModal';

export type UseRedirectModalReturnType = {
  reallocationModal: JSX.Element;
  openReallocationModal: (selectedOperation: OverviewProductionOrderOperationMapped) => void;
};
export interface ReallocationData {
  productionOrderId: number;
  workCenterId?: number;
  pO_RoutingId: number;
  planningDate?: string;
  limitCapacity: boolean;
}
/**
 *
 * @returns Reallocation of planning modal with form, form validation and function for opening it
 */
export const useReallocationOfPlanningModal = (
  refreshOverviewCallback: () => void,
): UseRedirectModalReturnType => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [reallocationConfirmModalOpen, setReallocationConfirmModalOpen] = useState<boolean>(false);

  const [reallocationData, setReallocationData] = useState<ReallocationData | undefined>(undefined);
  const [reallocationSubmitted, setReallocationSubmitted] = useState<boolean>(false);
  const [reallocationChanged, setReallocationChanged] = useState<boolean>(false);
  const { loading, entity } = useAppSelector((state) => state.productionOrders);

  const [selectedPOId, setSelectedPOid] = useState<number>();
  const dispatch = useAppDispatch();

  const { translate } = useTranslate({
    ns: 'reallocationOfPlanning',
  });

  const validationSchema = useReallocationOfPlanningSchema();
  const form = useForm<ReallocationOfPlanningForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const {
    setValue,
    watch,
    formState: { isValid },
    register,
  } = form;

  const { productionOrderDelivery, salesOrderDelivery } = watch();

  const nameof = nameofFactory<ReallocationOfPlanningForm>();

  const openReallocationConfirmModal = useCallback((data: ReallocationData): void => {
    setReallocationConfirmModalOpen(true);
    setReallocationData(data);
  }, []);

  const openReallocationModal = useCallback(
    (selectedOperation: OverviewProductionOrderOperationMapped): void => {
      debugger;
      setIsOpen(true);
      setSelectedPOid(selectedOperation.id);
      dispatch(getProductionOrder(selectedOperation.id));
    },
    [],
  );
  const closeModal = useCallback((): void => {
    setIsOpen(false);
    setSelectedPOid(undefined);
    if (reallocationChanged) {
      refreshOverviewCallback();
    }
    setReallocationChanged(false);
  }, [reallocationChanged, refreshOverviewCallback]);

  const unscheduleCloseModalCallback = useCallback((): void => {
    closeModal();
  }, [closeModal]);

  const reallocationSubmittedCallback = useCallback((): void => {
    setReallocationSubmitted(true);
  }, []);
  const reallocationOKCallback = useCallback((): void => {
    setReallocationSubmitted(false);
    setReallocationChanged(true);
    debugger;
  }, []);

  // useEffect(() => {
  //   if (!selectedPOId) return;
  //   dispatch(getProductionOrder(selectedPOId));
  // }, [selectedPOId, dispatch]);

  useEffect(() => {
    setValue('productionOrderNumber', entity?.productionOrder_Id ?? 0);
    setValue('productionOrderDelivery', entity?.foreseenDelivery || '');
    setValue('salesOrderDelivery', entity?.salesOrderDto?.salesOrderDelivery || '');
    setValue('reallocationOperations', entity?.pO_RoutingOperations);
    setValue('limitCapacity', true);
    debugger;
  }, [entity, setValue, entity?.pO_RoutingOperations]);

  const activePO = useMemo(
    () => entity?.finalDelivery || entity?.salesOrderDto?.salesOrderDelivery,
    [entity],
  );

  useReallocationValidation(
    form,
    unscheduleCloseModalCallback,
    entity?.id!,
    reallocationOKCallback,
    reallocationSubmitted,
  );

  const reallocationModal: JSX.Element = (
    <Modal
      centered
      open={isOpen}
      // okText={translate('ok_text')}
      // onOk={handleOk}
      cancelText={translate('cancel')}
      onCancel={closeModal}
      closable={true}
      title={translate('title')}
      className='reallocation-modal'
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
              >
                <>{translate('unschedule')}</>
              </CustomButton>

              <CustomSwitch
                label={translate('limitCapacity')}
                name={register('limitCapacity').name}
              />
            </div>
          </div>
          <div className='table-wrapper'>
            <ReallocationTable
              selectedPOId={selectedPOId}
              openReallocationConfirmModal={openReallocationConfirmModal}
            />
          </div>
          <ConfirmationModal
            open={isConfirmModalOpen}
            setIsOpen={setIsConfirmModalOpen}
            selectedProductionOrder={entity}
          />
          <ReallocationConfirmationModal
            isOpen={reallocationConfirmModalOpen}
            setIsOpen={setReallocationConfirmModalOpen}
            reallocationData={reallocationData!}
            reallocationSubmittedCallback={reallocationSubmittedCallback}
          />
        </FormProvider>
      )}
    </Modal>
  );

  return { reallocationModal, openReallocationModal };
};
