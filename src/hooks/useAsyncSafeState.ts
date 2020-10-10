import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const useAsyncSafeState = <T>(
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(initial);
  const cleanedUpRef = useRef(false);

  useEffect(
    () => () => {
      cleanedUpRef.current = true;
    },
    []
  );

  const safeSetState = useCallback((stateUpdater: SetStateAction<T>) => {
    if (!cleanedUpRef.current) {
      setState(stateUpdater);
    }
  }, []);

  return [state, safeSetState];
};

export default useAsyncSafeState;
