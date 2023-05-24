/**@module NotFoundPage */
import notFoundImg from '@/assets/images/404.svg';
import { LOGIN_PAGE } from '@/modules/auth/consts/pageRoutes';
import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/button/button.component';
import './notFound.scss';
/**
 *
 * @returns Page rendered by {@link GuardedRoute} in case the user is not authorized to access parts of the app
 */
const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state: RootState) => !!state.auth.token);
  const redirection = (): void => {
    navigate(isAuthenticated ? MAIN_LAYOUT : LOGIN_PAGE);
  };
  const { translate } = useTranslate({
    ns: 'not-found',
  });

  return (
    <div className='not-found-page' data-testid='not-found-page'>
      <div className='page-content'>
        <h1>{translate('title')}</h1>
        <p>{translate('description')}</p>
        <CustomButton color='orange' type='button' isDisabled={false} onClick={redirection}>
          {translate('button')}
        </CustomButton>
      </div>
      <div className='image-content'>
        <img src={notFoundImg} alt='error' />
      </div>
    </div>
  );
};

export default NotFoundPage;
