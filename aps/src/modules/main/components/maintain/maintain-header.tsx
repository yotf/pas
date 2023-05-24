/**
 * @module MaintainHeader
 */

import BackButton from '@/modules/shared/components/backButton/back-button.component';
import { FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../../../shared/hooks/translate.hook';
import { MaintainContext } from './contexts/maintain.context';
import useValidationChecks from './hooks/useValidationChecks';
import MaintainActions from './maintain-actions';
import './maintain-header.scss';

export type MaintainHeaderProps = {
  copy?: boolean;
  noActions?: boolean;
};
/**
 *
 * @param copy Passed fown to MaintainActions
 * @param noActions Should {@link MaintainActions} be rendered or not
 * @returns Header component with {@link BackButton}, title and {@link MaintainActions} depending on noAction param.
 * Also, the {@link useValidationChecks} hook is called in this component.
 */
const MaintainHeader: FC<MaintainHeaderProps> = ({ copy, noActions }: MaintainHeaderProps) => {
  const { ns, openRedirectModal } = useContext(MaintainContext);
  const { translate } = useTranslate({ ns });
  const navigate = useNavigate();
  const onBackClick = useCallback(
    (): void => openRedirectModal!(() => navigate('..')),
    [navigate, openRedirectModal],
  );
  useValidationChecks();

  return (
    <div className='maintain-header' data-testid='maintain-header'>
      <div className='maintain-back'>
        <BackButton onClick={onBackClick} />
        <h1>{translate('title')}</h1>
      </div>
      {!noActions && <MaintainActions copy={copy} />}
    </div>
  );
};

export default MaintainHeader;
