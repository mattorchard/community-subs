import { padZeros } from "../helpers/textHelpers";

export type TimeCode = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export type Cue = {
  id: string;
  start: number;
  end: number;
  lines: string[];
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

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
  hours,
  minutes,
  seconds,
  milliseconds,
}: TimeCode) =>
  `${padZeros(hours)}:${padZeros(minutes)}:${padZeros(seconds)}.${padZeros(
    milliseconds,
    3
  )}`;
