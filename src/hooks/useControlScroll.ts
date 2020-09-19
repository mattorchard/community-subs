import { useEffect } from "react";
import useAsRef from "./useAsRef";

const useControlScroll = (handleScroll: (scrollDelta: number) => void) => {
  const handlerRef = useAsRef(handleScroll);

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
  }, [handlerRef]);
};

export default useControlScroll;
