import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => savedCallback.current();
    const intervalId = setInterval(handler, delay);
    return () => clearInterval(intervalId);
  }, [delay]);
};

export default useInterval;
