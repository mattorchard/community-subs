import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cue } from "../types/cue";
import { useOnPlayerTimeChange } from "../contexts/PlayerControlsContext";
import "./CuePreview.css";
import { arraysAreEqual } from "../helpers/algoHelpers";
import { useCuesContext } from "../contexts/CuesContext";
import { getClassName } from "../helpers/domHelpers";
import { getOngoingCues } from "../helpers/cueHelpers";

const CuePreview: React.FC = () => {
  const [cuesToShow, setCuesToShow] = useState<Cue[]>([]);
  const lastTimeRef = useRef(0);
  const { cues, cueIndexById } = useCuesContext();

  const updateCuesToShow = useCallback(() => {
    const newCuesToShow = getOngoingCues(lastTimeRef.current, cues);

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
      const newCuesToShow = getOngoingCues(
        lastTimeRef.current,
        cues,
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
        <div
          className={getClassName(
            "cue-preview__cue",
            {
              "is-bold": cue.isBold,
              "is-italics": cue.isItalics,
            },
            `xl justify-${cue.settings?.justify}`
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
