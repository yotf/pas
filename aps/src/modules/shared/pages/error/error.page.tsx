/**
 * @module ErrorPage
 */
import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/button/button.component';
import { useTranslate } from '../../hooks/translate.hook';
import './error.page.scss';

export interface ErrorPageProps {
  resetErrorBoundary: (...args: Array<unknown>) => void;
}
/** @returns Page rendered in case of error by {@link PageGuard} component*/
const ErrorPage: FC<ErrorPageProps> = ({ resetErrorBoundary }) => {
  const navigate = useNavigate();
  const { translate } = useTranslate({
    ns: 'error-page',
  });
  const tryAgain = (): void => {
    resetErrorBoundary();
  };
  const redirection = (): void => {
    navigate(MAIN_LAYOUT);
  };

  return (
    <div className='error-page' data-testid='error-page'>
      <div className='page-content'>
        <h1>{translate('title')}</h1>
        <p>{translate('description')}</p>
        <div className='button-container'>
          <CustomButton color='orange' type='button' isDisabled={false} onClick={tryAgain}>
            {translate('button-try-again')}
          </CustomButton>
          <CustomButton color='orange' type='button' isDisabled={false} onClick={redirection}>
            {translate('button-go-back')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
