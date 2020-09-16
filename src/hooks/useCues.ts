import { Cue } from "../types/subtitles";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { getCues, saveCue } from "../repositories/ProjectRepository";

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
  const [cues, setCues] = useState<CueState | null>(null);

  // Get initial state
  useEffect(() => {
    let cancelled = false;
    getCues(transcriptId)
      .then((cues) => {
        if (!cancelled) {
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
    (cueToSave: CueToSave) =>
      setCues((oldCueState) => {
        if (!oldCueState) {
          return oldCueState;
        }
        // Construct the complete cue
        const newCue: Cue =
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

        saveCue(newCue).catch((error) =>
          console.warn("Failed to save cue", newCue, error)
        );

        const newCues = oldCueState.cues.filter((cue) => cue.id !== newCue.id);

        const index = newCues.findIndex(
          (otherCue) => cueComparator(newCue, otherCue) < 0
        );

        if (index === -1) {
          newCues.push(newCue);
        } else {
          newCues.splice(index, 0, newCue);
        }

        return {
          cues: newCues,
          index: getCueIndex(newCues),
        };
      }),
    [transcriptId]
  );

  return [cues, setCue];
};

export default useCues;
