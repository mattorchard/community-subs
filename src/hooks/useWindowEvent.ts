import { DependencyList, useCallback, useEffect } from "react";

const useWindowEvent = (
  eventName: string,
  callback: EventListener,
  deps: DependencyList
) => {
  const stableCallback = useCallback(callback, deps);
  useEffect(() => {
    window.addEventListener(eventName, stableCallback);
    return () => window.removeEventListener(eventName, stableCallback);
  }, [eventName, stableCallback]);
};

export default useWindowEvent;
