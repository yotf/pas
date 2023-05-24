/**
 * @module OperationMaintainPage
 */

import { FC } from 'react';
import OperationsLayout from './components/operations-maintain-layout';
import { useOperationMaintainSetup } from './hooks/useOperationMaintainSetup';
import './maintainStyles.scss';

export interface OperationMaintainType {
  copy?: boolean | undefined;
}
/**
 * @param copy If copy is true values are copied from an already created Operation and placed inside the form
 * The {@link useOperationMaintainSetup} hook is used to create a form and pass it down to {@link OperationsLayout}.
 * @returns A {@link OperationsLayout} component which contains {@link OperationsForm}.
 */
const OperationsMaintain: FC<OperationMaintainType> = ({ copy }: OperationMaintainType) => {
  const { form, operationForEdit, isLoaded } = useOperationMaintainSetup(Boolean(copy));

  return (
    <OperationsLayout
      form={form}
      operationForEdit={operationForEdit}
      isLoaded={isLoaded}
      copying={copy}
    />
  );
};

export default OperationsMaintain;
