/**@module ButtonInterface */
export interface Button {
  /**Button background and text color. New colors need to be added in global css */
  color: 'orange' | 'blue' | 'red' | 'green' | 'gray' | 'white';
  /** Button type */
  type: 'submit' | 'button' | 'reset' | undefined;
  /** Content rendered inside the button component (eg text, image) */
  children: JSX.Element | string | number;
  /** Disables button and changes its styling */
  isDisabled?: boolean;
  /** On click event callback */
  onClick?: (e: React.MouseEvent<any, MouseEvent>) => void;
  /** Additional css classes to be applied to button */
  customClass?: string;
  /** If button is loading renders a spinner */
  isLoading?: boolean;
}
