/**
 * @module useAllowedOperationsModal
 */

import searchIcon from '@/assets/search.png';
import CustomInput from '@/modules/shared/components/input/input.component';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Modal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form/dist/types/form';
import { useParams } from 'react-router-dom';
import { AllowedOperation } from '../../settings/redux/allowedOperations/interfaces';
import { getAllActiveOperationsByAllocationBased } from '../../settings/redux/allowedOperations/thunks';
import { Operation } from '../../settings/redux/operations/interfaces';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';
import './allowedOperationsModal.scss';
import { v4 as uuid } from 'uuid';

export type UseAllowedOperationsModalReturnType = {
  allowedOperationsModal: JSX.Element;
  openAllowedOperationsModal: () => void;
};

export type UseAllowedOperationsModalProps = {
  form: UseFormReturn<WorkCenterFormData, any>;
};
/**
 * @param form Work Center form. Inner form controls only allowed operations and allowed operation values are later used in this form.
 * The hook adds and removes operations from the table and renders them inside the {@link WorkCenterTable}
 * @returns Allowed operations modal
 */
export const useAllowedOperationsModal = ({
  form: outerForm,
}: UseAllowedOperationsModalProps): UseAllowedOperationsModalReturnType => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { id: workCenterId } = useParams();

  const { register, watch } = useFormContext();
  const { allowedOperations, allocationBased } = watch();
  const { dataByAllocation } = useAppSelector((state) => state.allowedOperations);
  const { translate } = useTranslate({ ns: 'workCenters', keyPrefix: 'allowedOperationsModal' });
  const { setValue } = outerForm;
  const [newAllowedOperations, setNewAllowedOperations] = useState(allowedOperations.slice());
  useEffect(() => {
    if (allocationBased !== undefined)
      dispatch(getAllActiveOperationsByAllocationBased(allocationBased));
  }, [allocationBased, dispatch]);

  const removeAllowedOperation = (id: number): void => {
    const newOperations = newAllowedOperations.filter(
      (operation: AllowedOperation) => operation.operationId !== id,
    );
    setNewAllowedOperations(newOperations);
  };

  useEffect(() => {
    const mappedAllowOperations: AllowedOperation[] = allowedOperations.map(
      (ao: AllowedOperation) =>
        ({
          id: ao.id,
          operation: ao.operation,
          operationId: ao.operationId,
          workCenter: ao.workCenter,
          workCenterId: Number(workCenterId),
        } as AllowedOperation),
    );
    setNewAllowedOperations(mappedAllowOperations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocationBased, isOpen]);

  const addAllowedOperation = (id: number): void => {
    const newAllowed = dataByAllocation.find((operation: Operation) => operation.id === id);
    const newAllowedOperation: AllowedOperation = {
      id: 0,
      operation: newAllowed!,
      operationId: newAllowed!.id,
      workCenter: null,
      workCenterId: Number(workCenterId) || 0,
      guid: uuid(),
    };
    setNewAllowedOperations([...newAllowedOperations, newAllowedOperation]);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOk = (): void => {
    setValue('allowedOperations', newAllowedOperations, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    closeModal();
  };

  const openAllowedOperationsModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const usedOperationIds = useMemo(() => {
    return new Set(
      newAllowedOperations
        ? newAllowedOperations.map((el: AllowedOperation) => el.operationId)
        : [],
    );
  }, [JSON.stringify(newAllowedOperations)]);

  const form = useForm<{ search: string }>({
    defaultValues: {
      search: '',
    },
  });

  const { search } = form.watch();

  const searchOperations = useMemo(
    () =>
      (arr: Operation[]): Operation[] => {
        const filteredOperations = arr.filter((item: Operation) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        );

        return filteredOperations.sort();
      },
    [search],
  );

  const allowedOperationsModal = (
    <FormProvider {...form}>
      <Modal
        centered
        open={isOpen}
        title={translate('title')}
        okText={translate('add')}
        onOk={handleOk}
        cancelText={translate('cancel')}
        onCancel={closeModal}
        wrapClassName={'work-center-modal'}
      >
        <div className='allowed-operations-modal'>
          <CustomInput
            type='text'
            placeholder={translate('search')}
            label={translate('search_label')}
            icon={searchIcon}
            register={register('search')}
            width={'full-width'}
          />
          <div className='operations'>
            {dataByAllocation &&
              searchOperations(dataByAllocation)
                .sort((a, b) => a.operation_Id - b.operation_Id)
                .map((operation: Operation) => {
                  return (
                    <div className='modal-item' key={operation.id}>
                      <div className='modal-info'>
                        <p>{operation.id}</p>
                        <p>{operation.name}</p>
                      </div>
                      <p>
                        {!usedOperationIds.has(operation.id) ? (
                          <span
                            className='add'
                            role={'presentation'}
                            onClick={(): void => addAllowedOperation(operation.id)}
                          >
                            {translate('add')}
                          </span>
                        ) : (
                          <span
                            className='remove'
                            role={'presentation'}
                            onClick={(): void => removeAllowedOperation(operation.id)}
                          >
                            {translate('remove')}
                          </span>
                        )}{' '}
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
      </Modal>
    </FormProvider>
  );
  return { allowedOperationsModal, openAllowedOperationsModal };
};
