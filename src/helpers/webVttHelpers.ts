import { CueState } from "../hooks/useCues";
import {
  Cue,
  CueSettings,
  timeCodeToFullString,
  toTimeCode,
} from "../types/subtitles";

export const toWebVtt = ({ cues }: CueState) => {
  return [
    getHeaders("Created with Community Subs"),
    getGlobalStyles(),
    getFormattedCues(cues),
  ].join("\n\n");
};

const getHeaders = (title: string) =>
  `WEBVTT  - ${title}

NOTE Created with Community Subs`;

const getGlobalStyles = () =>
  `STYLE
::cue {
  color: red
}`;

const getFormattedCues = (cues: Cue[]) =>
  cues
    .filter((cue) => cue.lines.length > 0)
    .map(formatCue)
    .join("\n\n");

const formatCue = (cue: Cue, index: number) =>
  `${index + 1}
${formatTimeRange(cue)} ${cue.settings ? formatSettings(cue.settings) : ""}
${cue.lines.filter((line) => line.trim()).join("\n")}`;

const formatTimeRange = ({ start, end }: { start: number; end: number }) =>
  `${timeCodeToFullString(toTimeCode(start))} --> ${timeCodeToFullString(
    toTimeCode(end)
  )}`;

const formatSettings = (settings: CueSettings) =>
  Object.entries(settings)
    .map(([setting, value]) => `${setting}:${value}`)
    .join(" ");
