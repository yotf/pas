/**
 * @module RouterInitialization
 */
import { authRouter } from '@/modules/auth/router';
import { mainRouter } from '@/modules/main/router';
import { createBrowserRouter } from 'react-router-dom';
/**
 * Main application router used to navigate between main routes and auth routes
 */
export const router = createBrowserRouter([authRouter, mainRouter]);
