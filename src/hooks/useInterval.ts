import { useEffect } from "react";
import useAsRef from "./useAsRef";

const useInterval = (callback: () => void, delay: number) => {
  const callbackRef = useAsRef(callback);

  useEffect(() => {
    const handler = () => callbackRef.current();
    const intervalId = setInterval(handler, delay);
    return () => clearInterval(intervalId);
  }, [delay, callbackRef]);
};

export default useInterval;
