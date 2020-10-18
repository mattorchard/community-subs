import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cue } from "../types/cue";
import { useOnPlayerTimeChange } from "../contexts/PlayerControlsContext";
import "./CuePreview.css";
import { arraysAreEqual } from "../helpers/algoHelpers";
import { useCuesContext } from "../contexts/CuesContext";
import { getClassName } from "../helpers/domHelpers";

const isCueOngoing = (currentTime: number, cue: Cue) =>
  cue.start <= currentTime && currentTime <= cue.end;

const filterCues = (currentTime: number, cues: Cue[], startIndex = 0) => {
  const filteredItems: Cue[] = [];
  for (let index = startIndex; index < cues.length; index++) {
    const cue = cues[index];
    if (isCueOngoing(currentTime, cue)) {
      filteredItems.push(cue);
    } else if (cue.start > currentTime) {
      // Early return once no more cues will ever be ongoing
      return filteredItems;
    }
  }
  return filteredItems;
};

const CuePreview: React.FC = () => {
  const [cuesToShow, setCuesToShow] = useState<Cue[]>([]);
  const lastTimeRef = useRef(0);
  const { cues, cueIndexById } = useCuesContext();

  const updateCuesToShow = useCallback(() => {
    const newCuesToShow = filterCues(lastTimeRef.current, cues);

    setCuesToShow((oldCuesToShow) =>
      arraysAreEqual(oldCuesToShow, newCuesToShow)
        ? oldCuesToShow
        : newCuesToShow
    );
  }, [cues]);

  useEffect(updateCuesToShow, [updateCuesToShow]);

  useOnPlayerTimeChange((time) => {
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const smallForwardAdjustment = delta > 0 && delta <= 1000 / 12;

    if (smallForwardAdjustment && cuesToShow.length > 0) {
      // Moved forward just a few frames
      const startIndex = cueIndexById.get(cuesToShow[0].id);
      if (startIndex === undefined) {
        return;
      }
      const newCuesToShow = filterCues(lastTimeRef.current, cues, startIndex);

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
        <div
          className={getClassName(
            "cue-preview__cue",
            {
              "is-bold": cue.isBold,
              "is-italics": cue.isItalics,
            },
            "xl"
          )}
          key={cue.id}
        >
          {cue.text}
        </div>
      ))}
    </div>
  );
};

export default CuePreview;
