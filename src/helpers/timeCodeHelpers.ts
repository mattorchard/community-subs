import { HOUR, MINUTE, SECOND } from "./timingHelpers";
import { padZeros } from "./textHelpers";

export type TimeCode = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export const timeCodeToMillis = (timeCode: TimeCode) =>
  HOUR * timeCode.hours +
  MINUTE * timeCode.minutes +
  SECOND * timeCode.seconds +
  timeCode.milliseconds;

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
