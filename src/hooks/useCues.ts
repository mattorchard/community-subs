import { Cue } from "../types/cue";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { getCues, saveCue } from "../repositories/EntityRepository";
import useAsRef from "./useAsRef";

export type CueState = {
  cues: Cue[];
  index: Map<string, number>;
};

type CueUpdate = Partial<Cue> & Pick<Cue, "id">;
type NewCue = Omit<Cue, "id" | "transcriptId">;
type CueToSave = CueUpdate | NewCue;

export type SetCue = (cue: CueToSave) => void;

const cueComparator = (a: Cue, b: Cue) => {
  if (a.start !== b.start) {
    return a.start - b.start;
  }
  return a.id.localeCompare(b.id);
};

const getCueIndex = (cuesOrdered: Cue[]) =>
  new Map(cuesOrdered.map((cue, index) => [cue.id, index]));

const useCues = (transcriptId: string): [CueState | null, SetCue] => {
  const [cueState, setCues] = useState<CueState | null>(null);
  const cueStateRef = useAsRef(cueState);

  // Get initial state
  useEffect(() => {
    let cancelled = false;
    getCues(transcriptId)
      .then((cues) => {
        if (!cancelled) {
          console.debug(`Loaded ${cues.length} cues`);
          cues.sort(cueComparator);
          setCues({
            cues,
            index: getCueIndex(cues),
          });
        }
      })
      .catch((error) =>
        console.error("Failed to load cues", transcriptId, error)
      );
    return () => {
      cancelled = true;
    };
  }, [transcriptId]);

  const setCue = useCallback(
    (cueToSave: CueToSave) => {
      if (!cueStateRef.current) {
        throw new Error("Cannot save cue before initial cue load");
      }

      const oldCueState = cueStateRef.current;

      // Construct the complete cue
      const fullCueToSave: Cue =
        "id" in cueToSave
          ? {
              ...oldCueState.cues[oldCueState.index.get(cueToSave.id)!],
              ...cueToSave,
              transcriptId,
            }
          : {
              ...cueToSave,
              id: uuidV4(),
              transcriptId,
            };

      const newCues = oldCueState.cues.filter(
        (cue) => cue.id !== fullCueToSave.id
      );

      const index = newCues.findIndex(
        (otherCue) => cueComparator(fullCueToSave, otherCue) < 0
      );

      if (index === -1) {
        newCues.push(fullCueToSave);
      } else {
        newCues.splice(index, 0, fullCueToSave);
      }

      setCues({
        cues: newCues,
        index: getCueIndex(newCues),
      });

      saveCue(fullCueToSave).catch((error) => {
        console.warn("Failed to save cue", fullCueToSave, error);
        throw error;
      });
    },
    [transcriptId, cueStateRef]
  );

  return [cueState, setCue];
};

export default useCues;
