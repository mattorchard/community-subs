import { useState } from "react";
import useWindowEvent from "./useWindowEvent";

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getSize);
  useWindowEvent("resize", () => setWindowSize(getSize()), []);
  return windowSize;
};

export default useWindowSize;
