/**
 * @module HomePage
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { FC } from 'react';
import HomeLogo from '@/assets/huni-logo.svg';
import './home.scss';
/**
 * User is redirected to this page after logging in
 * @returns Home Page
 */
const HomePage: FC = () => {
  const { translate } = useTranslate({
    ns: 'home',
  });

  return (
    <div className='home-page' data-testid='home-page'>
      <img src={HomeLogo} alt={translate('logo')} className='logo' />
    </div>
  );
};

export default HomePage;
