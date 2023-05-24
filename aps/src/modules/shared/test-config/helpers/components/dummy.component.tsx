/**@module DummyPage */
import React from 'react';

export const testPageText = 'Test page';
export const testPageId = 'test_id';
/**Used for testing of {@link GuardedRoute} and {@link AuthGuardRoute}*/
export const DummyPage: React.FC = () => {
  return <div data-testid={testPageId}>{testPageText}</div>;
};
