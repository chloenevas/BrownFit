import { Dispatch, SetStateAction } from "react";

/**
 * ControlledInputProps defines the properties required by the ControlledInput component.
 */
export interface ControlledInputProps {
  /**
   * The current value of the input field.
   */
  value: string;
  /**
   * A function to set the state value for the input field.
   */
  setValue: Dispatch<SetStateAction<string>>;

  /**
   * Aria label for accessibility purposes.
   */
  ariaLabel: string;
}

/**
 * ControlledInput is a reusable input component with controlled state.
 *
 * This component renders an input field and allows you to control its value and behavior
 * through props. It's particularly useful for managing form inputs in a React application.
 *
 * @param value - The current value of the input field.
 * @param setValue - A function to set the state value for the input field.
 * @param ariaLabel - Aria label for accessibility purposes.
 * @returns A controlled input field.
 */
export function ControlledInput({
  value,
  setValue,
  ariaLabel,
}: ControlledInputProps) {
  return (
    <input
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
      size={50}
    ></input>
  );
}
