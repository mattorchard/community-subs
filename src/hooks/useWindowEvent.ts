import { useEffect } from "react";
import useAsRef from "./useAsRef";

const useWindowEvent = <E extends Event>(
  eventName: string,
  callback: (event: E) => void
) => {
  const callbackRef = useAsRef(callback);
  useEffect(() => {
    const handler = (event: Event) => {
      callbackRef.current(event as E);
    };
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, callbackRef]);
};

export default useWindowEvent;
