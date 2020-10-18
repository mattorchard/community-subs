import { Cue } from "../types/cue";

export const getIndexOfFirstCueAfter = (time: number, cues: Cue[]) => {
  for (let index = 0; index < cues.length; index++) {
    const cue = cues[index];
    if (cue.start > time) {
      return index;
    }
  }
  return -1;
};

// Todo: Move other cue helpers (like comparator) here
