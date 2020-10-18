import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Cue, cueDefaults } from "../types/cue";
import {
  deleteCues as deleteCuesFromDb,
  getCues,
  putCuesBulk,
  saveCue,
  saveCues,
} from "../repositories/EntityRepository";
import useAsRef from "../hooks/useAsRef";
import { v4 as uuidV4 } from "uuid";
import { spliceIntoSortedArray } from "../helpers/algoHelpers";

type CuePatch = Partial<Cue> & Pick<Cue, "id">;
type NewCue = Partial<Omit<Cue, "id" | "transcriptId">> &
  Pick<Cue, "start" | "end">;

type CueContextActions = {
  createCue: (cue: NewCue) => void;
  updateCue: (cue: CuePatch) => void;
  updateCues: (cues: CuePatch[]) => void;
  deleteCues: (cues: Cue["id"][]) => void;
  createCuesBulk: (cues: Cue[]) => Promise<void>;
};

type CuesContextType = {
  cueIndexById: Map<string, number>;
} & CueContextActions &
  (
    | {
        loading: true;
        cues: Cue[] | null;
      }
    | {
        loading: boolean;
        cues: Cue[];
      }
  );

const CuesContext = React.createContext<CuesContextType | null>(null);

const cueComparator = (a: Cue, b: Cue) => {
  if (a.start !== b.start) {
    return a.start - b.start;
  }
  return a.id.localeCompare(b.id);
};

export const CuesContextProvider: React.FC<{ transcriptId: string }> = ({
  transcriptId,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [cues, setCues] = useState<Cue[] | null>(null);
  const cuesRef = useAsRef(cues);

  // Maintain a map of cueId -> index
  const cueIndexById = useMemo(
    () => new Map(cues ? cues.map((cue, index) => [cue.id, index]) : []),
    [cues]
  );

  const cueIndexByIdRef = useAsRef(cueIndexById);

  const loadCuesFromStorage = useCallback(() => {
    setLoading(true);
    // Todo: Performance monitoring
    return getCues(transcriptId).then((cues) => {
      console.debug(`Loaded ${cues.length} cues`);
      setCues(cues.sort(cueComparator));
      setLoading(false);
    });
  }, [transcriptId]);

  // Load initial cues
  useEffect(() => void loadCuesFromStorage(), [loadCuesFromStorage]);

  const cueActions = useMemo<CueContextActions>(() => {
    const createCue = (newCue: NewCue) => {
      if (!cuesRef.current) throw new Error("Cannot create before cues loaded");
      const fullCue = {
        ...cueDefaults,
        ...newCue,
        transcriptId,
        id: uuidV4(),
      };

      const saveCuesPromise = saveCue(fullCue);
      saveCuesPromise.catch(loadCuesFromStorage);

      const newCues = [...cuesRef.current];
      spliceIntoSortedArray(newCues, fullCue, cueComparator);
      setCues(newCues);

      return saveCuesPromise;
    };

    const getCueCurrent = (cueId: string) => {
      const index = cueIndexByIdRef.current.get(cueId)!;
      return cuesRef.current![index]!;
    };

    const updateCues = (cuePatches: CuePatch[]) => {
      if (!cuesRef.current) throw new Error("Cannot update before cues loaded");

      const fullCues = cuePatches.map((CuePatch) => ({
        ...getCueCurrent(CuePatch.id),
        ...CuePatch,
      }));

      const saveCuesPromise = saveCues(fullCues);
      saveCuesPromise.catch(loadCuesFromStorage);

      const cuesToRemove = new Set(cuePatches.map((cue) => cue.id));
      const newCues = cuesRef.current!.filter(
        (cue) => !cuesToRemove.has(cue.id)
      );
      fullCues.forEach((fullCue) =>
        spliceIntoSortedArray(newCues, fullCue, cueComparator)
      );
      setCues(newCues);

      return saveCuesPromise;
    };

    const updateCue = (CuePatch: CuePatch) => updateCues([CuePatch]);

    const deleteCues = (cueIds: Cue["id"][]) => {
      if (!cuesRef.current) throw new Error("Cannot delete before cues loaded");

      const deleteCuesPromise = deleteCuesFromDb(cueIds);
      deleteCuesPromise.catch(loadCuesFromStorage);

      const cuesToDelete = new Set(cueIds);
      setCues((cues) =>
        cues ? cues.filter((cue) => !cuesToDelete.has(cue.id)) : null
      );
    };

    const createCuesBulk = async (cues: Cue[]) => {
      await putCuesBulk(cues);
      await loadCuesFromStorage();
    };

    return { createCue, deleteCues, updateCue, updateCues, createCuesBulk };
  }, [transcriptId, cuesRef, cueIndexByIdRef, loadCuesFromStorage]);

  return (
    <CuesContext.Provider
      value={
        {
          cues,
          cueIndexById,
          loading,
          ...cueActions,
        } as CuesContextType
      }
    >
      {children}
    </CuesContext.Provider>
  );
};

const NO_PROVIDER_ERROR_MESSAGE = `Cannot use CuesContext outside provider`;

type CuesContextTypeSafe = Omit<CuesContextType, "cues"> & { cues: Cue[] };

export const useCuesContextUnsafe = () => {
  const context = useContext(CuesContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR_MESSAGE);
  return context;
};

export const useCuesContext = () => {
  const context = useContext(CuesContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR_MESSAGE);

  if (!context.cues) throw new Error(`Cues failed to load`);
  return context as CuesContextTypeSafe;
};
