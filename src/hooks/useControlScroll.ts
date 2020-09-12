import { useEffect, useRef } from "react";

const useControlScroll = (handleScroll: (scrollDelta: number) => void) => {
  const handlerRef = useRef(handleScroll);
  handlerRef.current = handleScroll;
  useEffect(() => {
    const handler = (event: WheelEvent) => {
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const scrollDelta = event.deltaX || event.deltaY || event.deltaZ;
      if (scrollDelta) {
        handlerRef.current(scrollDelta);
      }
    };

    document.body.addEventListener("wheel", handler, { passive: false });
    return () => document.body.removeEventListener("wheel", handler);
  }, []);
};

export default useControlScroll;
