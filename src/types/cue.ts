export type Alignment = "start" | "center" | "end";

// https://www.w3.org/TR/webvtt1/#cue-settings
export type CueSettings = {
  align: Alignment;
  justify: Alignment;
};

export type Cue = {
  transcriptId: string;
  id: string;
  start: number;
  end: number;
  text: string;
  layer: number;
  isBold: boolean;
  isItalics: boolean;
  settings?: CueSettings;
};

export const cueDefaults = {
  layer: 0,
  text: "",
  isBold: false,
  isItalics: false,
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
