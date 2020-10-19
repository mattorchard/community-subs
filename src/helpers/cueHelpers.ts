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

const isCueOngoing = (currentTime: number, cue: Cue) =>
  cue.start <= currentTime && currentTime <= cue.end;

export const getOngoingCues = (
  currentTime: number,
  cues: Cue[],
  startIndex = 0
) => {
  const filteredItems: Cue[] = [];
  for (let index = startIndex; index < cues.length; index++) {
    const cue = cues[index];
    if (isCueOngoing(currentTime, cue)) {
      filteredItems.push(cue);
    } else if (cue.start > currentTime) {
      // Early return once no more cues will ever be ongoing
      return filteredItems;
    }
  }
  return filteredItems;
};

export const cueComparator = (a: Cue, b: Cue) => {
  if (a.start !== b.start) {
    return a.start - b.start;
  }
  if (a.layer !== b.layer) {
    return a.layer - b.layer;
  }
  if (a.end !== b.end) {
    return a.end - b.end;
  }
  return a.id.localeCompare(b.id);
};
