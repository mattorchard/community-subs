import React, { useEffect, useRef } from "react";
import { debounce } from "../helpers/timingHelpers";
import useAsRef from "../hooks/useAsRef";
import { useLiveCallback } from "../hooks/useLiveCallback";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const DebouncedInput: React.FC<
  InputProps & {
    initialValue: string;
    onValueChange: (value: string) => void;
    delayAmount?: number;
  }
> = ({ initialValue, onValueChange, delayAmount = 2500, ...inputProps }) => {
  const ref = useRef<HTMLInputElement>(null);
  const initialValueRef = useAsRef(initialValue);
  const valueChangeLive = useLiveCallback(onValueChange);

  const { immediate: handleBlur, debounced: handleChange } = React.useMemo(
    () =>
      debounce(() => {
        if (ref.current && ref.current.value !== initialValueRef.current) {
          valueChangeLive(ref.current.value);
        }
      }, delayAmount),
    [valueChangeLive, delayAmount, initialValueRef]
  );

  // Sets inputs initial value
  useEffect(() => {
    ref.current!.value = initialValue;
  }, [initialValue]);

  // Invokes on unmount
  useEffect(() => handleBlur, [handleBlur]);

  return (
    <input
      {...inputProps}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={ref}
    />
  );
};

export default DebouncedInput;
