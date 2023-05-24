import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// vi.mock('@/utils/paths', () => ({
//   getData: () => {
//     return "http://localhost:26384/";
//   },
// }));

vi.mock("react-i18next", () => {
  const t = (str: string) => {
    return str;
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
      return {
        t,
        i18n: {
          changeLanguage: () => {
            return Promise.resolve();
          },
        },
      };
    },
    initReactI18next: {
      type: "3rdParty",
      init: vi.fn(),
    },
  };
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks()
  cleanup();
})

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };
  };
