import React, { useCallback, useContext, useMemo, useState } from "react";
import useAsRef from "../hooks/useAsRef";
import { useCuesContext } from "./CuesContext";

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

const NO_PROVIDER_ERROR = "Tried to use CueSelectionContext outside Provider";

export const useCueSelectionActions = () => {
  const context = useContext(CueSelectionContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  return context.actions;
};

// Todo: Rename to useSelectedCueIds
export const useCueSelection = () => {
  const context = useContext(CueSelectionContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  return context.state;
};

export const useIsCueSelected = (cueId: string) => useCueSelection().has(cueId);

export const useSelectedCueIndexes = () => {
  const selectedCueIds = useCueSelection();
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
