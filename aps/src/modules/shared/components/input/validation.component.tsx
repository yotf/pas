/**
 * @module InputValidation
 */

import React from 'react';
export interface ValidationMessage {
  message: string;
}
/**
 *
 * @param message Message to be shown to user
 * @returns A validation error message with custom text
 */
const Validation: React.FC<ValidationMessage> = ({ message }) => {
  return (
    <span className='error-message' data-testid='validation-message'>
      {message}
    </span>
  );
};

export default Validation;
