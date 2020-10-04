import React, { useEffect, useState } from "react";

type ManualResizeObserver = {
  observe: (element: HTMLElement) => void;
  disconnect: () => void;
};

const useBounds = (ref: React.RefObject<HTMLElement | undefined>) => {
  const [size, setSize] = useState(() => {
    if (ref.current) {
      const { width, height, x, y } = ref.current.getBoundingClientRect();
      return { width, height, x, y };
    } else {
      return { width: 0, height: 0 };
    }
  });
  useEffect(() => {
    // @ts-ignore
    const observer: ManualResizeObserver = new ResizeObserver(() => {
      const { width, height, x, y } = ref.current!.getBoundingClientRect();
      setSize({ width, height, x, y });
    });
    observer.observe(ref.current!);
    return () => {
      observer.disconnect();
    };
  }, [ref]);
  return size;
};

export default useBounds;
