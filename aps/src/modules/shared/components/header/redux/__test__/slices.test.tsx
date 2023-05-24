import { InitialState } from '../interfaces';
import { sideMenuReducer, toggleMenu } from '../slices';

test('Should return the initial state', () => {
  expect(sideMenuReducer(undefined, { type: undefined })).toEqual({
    sideMenu: false,
  });
});

test('Should toggle menu', () => {
  const previousState: InitialState = { sideMenu: true };

  expect(sideMenuReducer(previousState, toggleMenu())).toEqual({ sideMenu: false });
});
