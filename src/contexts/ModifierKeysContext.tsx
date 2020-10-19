import React, { useCallback, useEffect, useRef } from "react";
import { Observable } from "../helpers/observableHelpers";
import useBodyEvent from "../hooks/useBodyEvent";
import { objectsAreEqual } from "../helpers/algoHelpers";
import { getModifierKeys, ModifierKeys } from "../helpers/domHelpers";
import useContextSafe from "../hooks/useContextSafe";
import { useLiveCallback } from "../hooks/useLiveCallback";

const ModifierKeysContext = React.createContext<{
  observer: Observable<ModifierKeys>;
  valueRef: { current: ModifierKeys };
} | null>(null);
ModifierKeysContext.displayName = "ModifierKeysContext";

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
  useBodyEvent("pointerover", updateModifierKeys);

  return (
    <ModifierKeysContext.Provider
      value={{ valueRef, observer: observerRef.current }}
    >
      {children}
    </ModifierKeysContext.Provider>
  );
};

export const useModifierKeys = () =>
  useContextSafe(ModifierKeysContext).valueRef;

export const useOnModifierKeysChange = (
  onChange: (keys: ModifierKeys) => void
) => {
  const { observer } = useContextSafe(ModifierKeysContext);
  const onChangeLive = useLiveCallback(onChange);
  useEffect(() => observer.subscribe(onChangeLive), [observer, onChangeLive]);
};
