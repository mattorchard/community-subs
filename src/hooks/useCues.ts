import { Cue } from "../types/subtitles";
import { useCallback, useState } from "react";
import mockCues from "../data/mockCues";

export type CueMap = { [cueId: string]: Cue };
export type CueUpdate = Partial<Cue> & { id: string };

const useCues = (): [CueMap, (cue: CueUpdate) => void] => {
  const [cues, setCues] = useState<CueMap>(() =>
    Object.fromEntries(mockCues.map((cue) => [cue.id, cue]))
  );
  const saveCue = useCallback(
    (cue: CueUpdate) =>
      setCues((cues) => ({ ...cues, [cue.id]: { ...cues[cue.id], ...cue } })),
    []
  );
  return [cues, saveCue];
};

export default useCues;
