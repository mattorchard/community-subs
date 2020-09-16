import { HOUR, MINUTE, SECOND } from "./timingHelpers";
import { useMemo } from "react";

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

const useTimelineMarkerSpacing = (scale: number) =>
  useMemo(() => getBestSpacing(scale), [scale]);

export default useTimelineMarkerSpacing;
