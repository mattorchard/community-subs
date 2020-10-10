import useWindowEvent from "./useWindowEvent";
import {
  getModifierKeys,
  ModifierKeys,
  queryAncestor,
} from "../helpers/domHelpers";
import useAsRef from "./useAsRef";
import { useCallback } from "react";
import { throttle } from "../helpers/timingHelpers";

const isWithinTextInput = ({ target }: KeyboardEvent) =>
  queryAncestor(target as Node, "input,textarea");

const matchesModifierKeys = (
  expectedModifierKeys: Partial<ModifierKeys>,
  event: KeyboardEvent | PointerEvent
) => {
  const actualModifierKeys = getModifierKeys(event);
  return Object.entries(expectedModifierKeys).every(
    ([key, expectedValue]) =>
      actualModifierKeys[key as keyof typeof expectedModifierKeys] ===
      expectedValue
  );
};

const useShortcut = (
  key: string,
  callback: (event: KeyboardEvent) => void,
  modifierKeys?: Partial<ModifierKeys>
) => {
  const callbackRef = useAsRef(callback);
  const throttledCallback = useCallback(
    throttle((event) => callbackRef.current(event), 125),
    []
  );

  useWindowEvent<KeyboardEvent>("keydown", (event) => {
    if (event.key.toLowerCase() !== key.toLowerCase()) {
      // Not the right button, just ignore
      return;
    }
    if (modifierKeys) {
      if (matchesModifierKeys(modifierKeys, event)) {
        throttledCallback(event);
      }
    } else if (!isWithinTextInput(event)) {
      throttledCallback(event);
    }
  });
};

export default useShortcut;
