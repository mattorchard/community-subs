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

export type Transcript = {
  id: string;
  name: string;
  createdAt: Date;
  accessedAt: Date;
  video?: VideoMeta;
};

export type VideoMeta = {
  id: string;
  createdAt: Date;
  name: string;
  duration: number;
} & (
  | {
      type: "youtube";
    }
  | {
      type: "upload";
      thumbnailUrl: string;
    }
);
