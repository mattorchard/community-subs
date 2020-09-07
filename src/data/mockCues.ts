import { Cue } from "../types/subtitles";

const mockCues: Cue[] = [
  {
    id: "0",
    start: 1000,
    end: 2000,
    lines: ["Howdy Partner"],
  },
  {
    id: "1",
    start: 2000,
    end: 3000,
    lines: ["How goes it?", "Are you selling that armadillo?"],
  },
  {
    id: "2",
    start: 5000,
    end: 7000,
    lines: ["I bet, sounds like a real doozy"],
  },
];

export default mockCues;
