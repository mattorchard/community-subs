import React, { useCallback, useMemo, useState } from "react";
import useAsRef from "../hooks/useAsRef";
import { useCuesContext } from "./CuesContext";
import useContextSafe from "../hooks/useContextSafe";

type CueSelectionContextValue = {
  state: Set<string>;
  actions: CueSelectionActions;
};

type CueSelectionActions = {
  setSelection: (selection: string | Set<string>) => void;
  clearSelection: () => void;
  addToSelection: (cueId: string) => void;
  removeFromSelection: (cueId: string) => void;
};

const CueSelectionContext = React.createContext<CueSelectionContextValue | null>(
  null
);

export const CueSelectionProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<Set<string>>(new Set());
  const stateRef = useAsRef(state);
  const setStateAndPublish = useCallback((selection: Set<string>) => {
    setState(selection);
  }, []);

  const actions: CueSelectionActions = useMemo(
    () => ({
      setSelection: (selection) =>
        setStateAndPublish(
          typeof selection === "string" ? new Set([selection]) : selection
        ),
      clearSelection: () => setStateAndPublish(new Set()),
      addToSelection: (cueId) => {
        const newSelection = new Set(stateRef.current);
        newSelection.add(cueId);
        setStateAndPublish(newSelection);
      },
      removeFromSelection: (cueId) => {
        const newSelection = new Set(stateRef.current);
        newSelection.delete(cueId);
        setStateAndPublish(newSelection);
      },
    }),
    [stateRef, setStateAndPublish]
  );

  const context = {
    state,
    actions,
  };
  return (
    <CueSelectionContext.Provider value={context}>
      {children}
    </CueSelectionContext.Provider>
  );
};

export const useCueSelectionActions = () =>
  useContextSafe(CueSelectionContext).actions;

export const useSelectedCueIds = () =>
  useContextSafe(CueSelectionContext).state;

export const useIsCueSelected = (cueId: string) =>
  useSelectedCueIds().has(cueId);

export const useSelectedCueIndexes = () => {
  const selectedCueIds = useSelectedCueIds();
  const { cueIndexById } = useCuesContext();
  return useMemo(
    () => [...selectedCueIds].map((cueId) => cueIndexById.get(cueId)!),
    [selectedCueIds, cueIndexById]
  );
};

export const useSelectedCues = () => {
  const selectedCueIndexes = useSelectedCueIndexes();
  const { cues } = useCuesContext();
  return useMemo(() => selectedCueIndexes.map((index) => cues[index]), [
    selectedCueIndexes,
    cues,
  ]);
};
