/**
 * @module PageOutlet
 */

import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const PageOutlet: FC = () => {
  return (
    <div className='outlet' data-testid='page-outlet'>
      <Outlet />
    </div>
  );
};

export default PageOutlet;
