import useWindowEvent from "./useWindowEvent";
import { queryAncestor } from "../helpers/domHelpers";
import useAsRef from "./useAsRef";
import { useCallback } from "react";
import { throttle } from "../helpers/timingHelpers";

const isWithinTextInput = ({ target }: KeyboardEvent) =>
  queryAncestor(target as Node, "input,textarea");

const useShortcut = (key: string, callback: (event: KeyboardEvent) => void) => {
  const callbackRef = useAsRef(callback);
  const throttledCallback = useCallback(
    throttle((event) => callbackRef.current(event), 125),
    []
  );

  useWindowEvent<KeyboardEvent>("keydown", (event) => {
    if (
      event.key.toLowerCase() === key.toLowerCase() &&
      !isWithinTextInput(event)
    ) {
      throttledCallback(event);
    }
  });
};

export default useShortcut;
