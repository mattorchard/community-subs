import { Cue } from "../types/subtitles";
import { useCallback, useState } from "react";

export type CueMap = Map<string, Cue>;
export type CueUpdate = Partial<Cue> & { id: string };

const cueComparator = (a: Cue, b: Cue) => {
  if (a.start !== b.start) {
    return a.start - b.start;
  }
  return a.id.localeCompare(b.id);
};

const useCues = (): [CueMap, (cue: CueUpdate) => void] => {
  const [cues, setCues] = useState<CueMap>(() => new Map());
  const saveCue = useCallback(
    (cueUpdate: CueUpdate) =>
      setCues((oldCues) => {
        const newCue = oldCues.has(cueUpdate.id)
          ? { ...oldCues.get(cueUpdate.id)!, ...cueUpdate }
          : (cueUpdate as Cue); // Todo: Add validation

        if (cueUpdate.start) {
          const entries = [...oldCues.entries()].filter(
            ([id]) => id !== cueUpdate.id
          );
          const indexOfFirstSmallerCue = entries.findIndex(
            ([, otherCue]) => cueComparator(newCue, otherCue) < 0
          );
          const index =
            indexOfFirstSmallerCue >= 0 ? indexOfFirstSmallerCue + 1 : 0;
          entries.splice(index, 0, [newCue.id, newCue]);

          return new Map(entries);
        } else {
          const newCues = new Map(oldCues);
          newCues.set(newCue.id, newCue);
          return newCues;
        }
      }),
    []
  );
  return [cues, saveCue];
};

export default useCues;
