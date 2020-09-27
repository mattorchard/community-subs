// Takes the form ###%
type Percentage = string;

export type CueSettings = Partial<{
  vertical: "rl" | "lr";
  line: number | Percentage;
  position: Percentage;
  size: Percentage;
  align: "start" | "middle" | "end";
}>;

export type Cue = {
  transcriptId: string;
  id: string;
  start: number;
  end: number;
  text: string;
  layer: number;
  settings?: CueSettings;
};
