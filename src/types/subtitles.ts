import { padZeros } from "../helpers/textHelpers";
import { HOUR, MINUTE, SECOND } from "../helpers/timingHelpers";

export type TimeCode = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

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

export const toTimeCode = (millis: number): TimeCode => {
  let millisRemaining = millis;
  const hours = Math.floor(millisRemaining / HOUR);
  millisRemaining = millisRemaining % HOUR;

  const minutes = Math.floor(millisRemaining / MINUTE);
  millisRemaining = millisRemaining % MINUTE;

  const seconds = Math.floor(millisRemaining / SECOND);
  millisRemaining = millisRemaining % SECOND;

  const milliseconds = Math.floor(millisRemaining);

  return { hours, minutes, seconds, milliseconds };
};

export const timeCodeToString = ({
  minutes,
  seconds,
  milliseconds,
}: TimeCode) =>
  `${padZeros(minutes)}:${padZeros(seconds)}.${padZeros(milliseconds, 3)}`;

export const timeCodeToFullString = (timeCode: TimeCode) =>
  `${padZeros(timeCode.hours)}:${timeCodeToString(timeCode)}`;

export const toTimeRangeString = ({
  start,
  end,
}: {
  start: number;
  end: number;
}) =>
  `${timeCodeToString(toTimeCode(start))} - ${timeCodeToString(
    toTimeCode(end)
  )}`;
