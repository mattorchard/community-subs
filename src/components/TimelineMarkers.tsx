import React, { CSSProperties } from "react";
import { HOUR, MINUTE, SECOND } from "../helpers/timingHelpers";
import { timeCodeToString, toTimeCode } from "../types/subtitles";
import "./TimelineMarkers.css";

const SPACINGS = [
  10 * HOUR,
  5 * HOUR,
  HOUR,
  30 * MINUTE,
  15 * MINUTE,
  10 * MINUTE,
  5 * MINUTE,
  MINUTE,
  30 * SECOND,
  15 * SECOND,
  10 * SECOND,
  5 * SECOND,
  SECOND,
  0.5 * SECOND,
  0.25 * SECOND,
];

const getBestSpacing = (scale: number, target = 300) => {
  let bestSpacing = SPACINGS[0];
  SPACINGS.forEach((currentSpacing) => {
    const bestDelta = Math.abs(bestSpacing * scale - target);
    const currentDelta = Math.abs(currentSpacing * scale - target);
    if (currentDelta < bestDelta) {
      bestSpacing = currentSpacing;
    }
  });
  return bestSpacing;
};

const TimelineMarker: React.FC<{ time: number }> = React.memo(({ time }) => (
  <div
    className="timeline-marker"
    style={{ "--marker-time": time } as CSSProperties}
  >
    {timeCodeToString(toTimeCode(time))}
  </div>
));

const TimelineMarkers: React.FC<{
  duration: number;
  scale: number;
}> = React.memo(({ duration, scale }) => {
  const spacing = getBestSpacing(scale);
  const markerCount = Math.max(Math.floor(duration / spacing) - 1, 0);

  return (
    <>
      {new Array(markerCount).fill(null).map((_, index) => (
        <TimelineMarker key={index} time={spacing * (index + 1)} />
      ))}
    </>
  );
});

export default TimelineMarkers;
