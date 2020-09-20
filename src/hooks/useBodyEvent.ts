import { useEffect } from "react";
import useAsRef from "./useAsRef";

const useBodyEvent = <E extends Event>(
  eventName: string,
  callback: (event: E) => void
) => {
  const callbackRef = useAsRef(callback);
  useEffect(() => {
    const handler = (event: Event) => callbackRef.current(event as E);
    document.body.addEventListener(eventName, handler);
    return () => document.body.removeEventListener(eventName, handler);
  }, [eventName, callbackRef]);
};

export default useBodyEvent;
