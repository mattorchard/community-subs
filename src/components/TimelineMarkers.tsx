import React, { CSSProperties } from "react";
import useTimelineMarkerSpacing from "../helpers/useTimelineMarkerSpacing";
import { formatAsTimeCode, TimeCodeFormat } from "../helpers/timeCodeHelpers";
import "./TimelineMarkers.css";
import { HOUR } from "../helpers/timingHelpers";

const getMarkerTimes = (
  startTime: number,
  endTime: number,
  timeBetween: number,
  maxTime: number
) => {
  const times = [];
  let currentTime = Math.max(timeBetween, startTime - timeBetween);
  if (currentTime < maxTime) {
    times.push(currentTime);
  }
  while (currentTime <= endTime + timeBetween && currentTime < maxTime) {
    currentTime += timeBetween;
    times.push(currentTime);
  }
  return times;
};

const getHours = (time: number) => Math.max(0, Math.floor(time / HOUR));

const TimelineMarkers: React.FC<{
  start: number;
  width: number;
  scale: number;
  duration: number;
}> = React.memo(({ start, width, scale, duration }) => {
  const timeBetween = useTimelineMarkerSpacing(scale);
  const startTime = Math.floor(start / scale / timeBetween) * timeBetween;
  const endTime = startTime + width / scale;

  const markerTimings = getMarkerTimes(
    startTime,
    endTime,
    timeBetween,
    duration
  );

  const format = {
    hours: getHours(startTime) !== getHours(endTime),
    milliseconds: Boolean(timeBetween % 1000),
  };

  return (
    <>
      {markerTimings.map((time) => (
        <TimelineMarker key={time} time={time} format={format} />
      ))}
    </>
  );
});

const TimelineMarker: React.FC<{
  time: number;
  format: TimeCodeFormat;
}> = React.memo(({ time, format }) => (
  <>
    <div
      className="timeline-marker timeline-marker--label"
      style={{ "--time": time } as CSSProperties}
    >
      {formatAsTimeCode(time, format)}
    </div>
    <div
      className="timeline-marker timeline-marker--rule"
      style={{ "--time": time } as CSSProperties}
    />
  </>
));

export default TimelineMarkers;
