import { Cue, CueSettings } from "../types/cue";
import { timeCodeToFullString, toTimeCode } from "./timeCodeHelpers";

export const toWebVtt = (cues: Cue[]) => {
  return [
    getHeaders("Created with Community Subs"),
    getGlobalStyles(),
    getFormattedCues(cues),
  ].join("\n\n");
};

const getHeaders = (title: string) =>
  `WEBVTT - ${title}

NOTE Created with Community Subs`;

const getGlobalStyles = () =>
  `STYLE
::cue {
  color: red
}`;

const getFormattedCues = (cues: Cue[]) =>
  cues
    .filter((cue) => cue.text.trim())
    .map(formatCue)
    .join("\n\n");

const formatCue = (cue: Cue, index: number) =>
  `${index + 1}
${formatTimeRange(cue)} ${cue.settings ? formatSettings(cue.settings) : ""}
${cue.text
  .split("\n")
  .filter((line) => line.trim())
  .join("\n")}`;

const formatTimeRange = ({ start, end }: { start: number; end: number }) =>
  `${timeCodeToFullString(toTimeCode(start))} --> ${timeCodeToFullString(
    toTimeCode(end)
  )}`;

const asSettings = (object: { [key: string]: string | undefined | null }) =>
  Object.entries(object)
    .filter(([, value]) => Boolean(value))
    .map(([setting, value]) => `${setting}:${value}`)
    .join(" ");

const justifyToPosition = {
  start: "20%",
  center: null,
  end: "80%",
};
const alignToLine = {
  start: "0%",
  center: "50%",
  end: null,
};

const formatSettings = (settings: CueSettings) =>
  asSettings({
    align: settings.justify, // Text-alignment is horizontal
    position: justifyToPosition[settings.justify],
    line: alignToLine[settings.align],
  });
