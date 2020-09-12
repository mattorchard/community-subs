import { Cue } from "../types/subtitles";
import { useCallback, useState } from "react";
import { v4 as uuidV4 } from "uuid";

export type CueState = {
  cues: Cue[];
  index: Map<string, number>;
};

type CueUpdate = Partial<Cue> & Pick<Cue, "id">;
type NewCue = Omit<Cue, "id">;
export type SaveCue = (cue: CueUpdate | NewCue) => void;

const cueComparator = (a: Cue, b: Cue) => {
  if (a.start !== b.start) {
    return a.start - b.start;
  }
  return a.id.localeCompare(b.id);
};

const initialState = {
  cues: [],
  index: new Map(),
};

const useCues = (): [CueState, SaveCue] => {
  const [cues, setCues] = useState<CueState>(initialState);
  const saveCue = useCallback(
    (cueToSave: CueUpdate | NewCue) =>
      setCues((oldCueState) => {
        // Construct the complete cue
        const newCue: Cue =
          "id" in cueToSave
            ? {
                ...oldCueState.cues[oldCueState.index.get(cueToSave.id)!],
                ...cueToSave,
              }
            : {
                ...cueToSave,
                id: uuidV4(),
              };

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
          index: new Map(newCues.map((cue, index) => [cue.id, index])),
        };
      }),
    []
  );

  return [cues, saveCue];
};

export default useCues;
