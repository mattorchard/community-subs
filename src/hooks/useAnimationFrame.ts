import { useEffect } from "react";
import useAsRef from "./useAsRef";

const useAnimationFrame = (callback: () => void) => {
  const callbackRef = useAsRef(callback);
  useEffect(() => {
    let cancelled = false;
    const rafCallback = () => {
      if (!cancelled) {
        callbackRef.current?.();
        requestAnimationFrame(rafCallback);
      }
    };
    requestAnimationFrame(rafCallback);
    return () => {
      cancelled = true;
    };
  }, [callbackRef]);
};

export default useAnimationFrame;
