import { MutableRefObject, useCallback } from "react";
import useBodyEvent from "./useBodyEvent";
import { getClassName } from "../helpers/domHelpers";

const getModifierKeys = (event: KeyboardEvent | PointerEvent) => ({
  alt: event.altKey,
  ctrl: event.ctrlKey,
  meta: event.metaKey,
  shift: event.shiftKey,
});

const useModifierKeyClasses = (ref: MutableRefObject<HTMLElement | null>) => {
  const updateModifierKeys = useCallback(
    (event: KeyboardEvent | PointerEvent) => {
      if (ref.current) {
        const modifierKeys = getModifierKeys(event);
        ref.current.setAttribute(
          "class",
          getClassName("modifier-key", modifierKeys)
        );
      }
    },
    [ref]
  );

  useBodyEvent("keydown", updateModifierKeys);
  useBodyEvent("keyup", updateModifierKeys);
  useBodyEvent("pointerenter", updateModifierKeys);
};

export default useModifierKeyClasses;
