import { useCallback } from "react";
import useAsRef from "./useAsRef";

export const useLiveCallback = <T extends any[], R>(
  callback: (...args: T) => R
) => {
  const callbackRef = useAsRef(callback);
  return useCallback(
    (...args: T) => callbackRef.current(...args),
    // Specified to avoid warning, but will never change
    [callbackRef]
  );
};
