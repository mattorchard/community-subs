import React, { useEffect, useRef } from "react";
import { debounce } from "../helpers/timingHelpers";
import useAsRef from "../hooks/useAsRef";

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

  // Ref invoked on value change
  const valueChangeRef = useAsRef(onValueChange);

  const { immediate: handleBlur, debounced: handleChange } = React.useMemo(
    () =>
      debounce(() => {
        if (ref.current && ref.current.value !== initialValue) {
          valueChangeRef.current(ref.current.value);
        }
      }, delayAmount),
    // eslint-disable-next-line
    []
  );

  // Sets inputs initial value
  useEffect(() => {
    ref.current!.value = initialValue;
  }, [initialValue]);

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
