import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cue } from "../types/cue";
import { usePlayerTimeCallback } from "../contexts/VideoTimeContext";
import "./CuePreview.css";
import { arraysAreEqual, filterConsecutive } from "../helpers/algoHelpers";

const isCueOngoing = (currentTime: number, cue: Cue) =>
  cue.start <= currentTime && currentTime <= cue.end;

const CuePreview: React.FC<{ cues: Cue[]; cueIndex: Map<string, number> }> = ({
  cues,
  cueIndex,
}) => {
  const [cuesToShow, setCuesToShow] = useState<Cue[]>([]);
  const lastTimeRef = useRef(0);

  const updateCuesToShow = useCallback(() => {
    // Todo: Get startIndex using binary search
    const startIndex = cues.findIndex((cue) =>
      isCueOngoing(lastTimeRef.current, cue)
    );

    if (startIndex === -1) {
      return;
    }

    const newCuesToShow = filterConsecutive(
      cues,
      (cue) => isCueOngoing(lastTimeRef.current, cue),
      startIndex
    );

    setCuesToShow((oldCuesToShow) =>
      arraysAreEqual(oldCuesToShow, newCuesToShow)
        ? oldCuesToShow
        : newCuesToShow
    );
  }, [cues]);

  useEffect(updateCuesToShow, [updateCuesToShow]);

  usePlayerTimeCallback((time) => {
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const smallForwardAdjustment = delta > 0 && delta <= 1000 / 12;

    if (smallForwardAdjustment && cuesToShow.length > 0) {
      // Moved forward just a few frames
      const startIndex = cueIndex.get(cuesToShow[0].id);
      if (startIndex === undefined) {
        return;
      }
      const newCuesToShow = filterConsecutive(
        cues,
        (cue) => isCueOngoing(lastTimeRef.current, cue),
        startIndex
      );

      setCuesToShow((oldCuesToShow) =>
        arraysAreEqual(oldCuesToShow, newCuesToShow)
          ? oldCuesToShow
          : newCuesToShow
      );
    } else {
      // Full update
      lastTimeRef.current = time;
      updateCuesToShow();
    }
  });

  return (
    <div className="cue-preview">
      {cuesToShow.map((cue) => (
        <div className="cue-preview__cue xl ellipses" key={cue.id}>
          {cue.text}
        </div>
      ))}
    </div>
  );
};

export default CuePreview;
