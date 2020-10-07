import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Observable } from "../helpers/observableHelpers";
import useBodyEvent from "../hooks/useBodyEvent";
import { objectsAreEqual } from "../helpers/algoHelpers";
import useAsRef from "../hooks/useAsRef";

const ModifierKeysContext = React.createContext<{
  observer: Observable<ModifierKeys>;
  valueRef: { current: ModifierKeys };
} | null>(null);

const getModifierKeys = (event: KeyboardEvent | PointerEvent) => ({
  alt: event.altKey,
  ctrl: event.ctrlKey,
  meta: event.metaKey,
  shift: event.shiftKey,
});
type ModifierKeys = ReturnType<typeof getModifierKeys>;
const initialValues = {
  alt: false,
  ctrl: false,
  meta: false,
  shift: false,
};

export const ModifierKeysContextProvider: React.FC = ({ children }) => {
  const observerRef = useRef(new Observable<ModifierKeys>());
  const valueRef = useRef(initialValues);

  const updateModifierKeys = useCallback((event) => {
    const modifierKeys = getModifierKeys(event);
    if (!objectsAreEqual(modifierKeys, valueRef.current)) {
      valueRef.current = modifierKeys;
      observerRef.current.publish(valueRef.current);
    }
  }, []);

  useBodyEvent("keydown", updateModifierKeys);
  useBodyEvent("keyup", updateModifierKeys);
  useBodyEvent("pointerenter", updateModifierKeys);

  return (
    <ModifierKeysContext.Provider
      value={{ valueRef, observer: observerRef.current }}
    >
      {children}
    </ModifierKeysContext.Provider>
  );
};

const NO_PROVIDER_ERROR = "Cannot use ModifierKeysContext outside of provider";

export const useModifierKeys = () => {
  const context = useContext(ModifierKeysContext);
  if (!context) {
    throw new Error(NO_PROVIDER_ERROR);
  }
  return context.valueRef.current;
};

export const useOnModifierKeysChange = (
  onChange: (keys: ModifierKeys) => void
) => {
  const context = useContext(ModifierKeysContext);
  if (!context) {
    throw new Error(NO_PROVIDER_ERROR);
  }
  const { observer } = context;
  const onChangeRef = useAsRef(onChange);
  useEffect(() => observer.subscribe((keys) => onChangeRef.current(keys)), [
    observer,
    onChangeRef,
  ]);
};
