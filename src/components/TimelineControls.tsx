import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnet, faRulerCombined } from "@fortawesome/free-solid-svg-icons";
import "./TimelineControls.css";
import { useToolsContext } from "../contexts/ToolsContext";
import useShortcut from "../hooks/useShortcut";

const TimelineControls = () => {
  const {
    isSnapToOthersEnabled,
    isSnapToGridEnabled,
    setIsSnapToOthersEnabled,
    setIsSnapToGridEnabled,
  } = useToolsContext();

  const toggleSnapToOthers = () =>
    setIsSnapToOthersEnabled((enabled) => !enabled);
  const toggleSnapToGrid = () => setIsSnapToGridEnabled((enabled) => !enabled);

  useShortcut("o", toggleSnapToOthers, { shift: true });
  useShortcut("g", toggleSnapToGrid, { shift: true });

  return (
    <div role="group" className="timeline-controls button-group with-dividers">
      <button
        title="Snap to others (shift + O)"
        className="icon-button timeline__toggle-button"
        aria-pressed={isSnapToOthersEnabled}
        onClick={toggleSnapToOthers}
      >
        <FontAwesomeIcon icon={faMagnet} />
      </button>
      <button
        title="Snap to grid (shift + G)"
        className="icon-button timeline__toggle-button"
        aria-pressed={isSnapToGridEnabled}
        onClick={toggleSnapToGrid}
      >
        <FontAwesomeIcon icon={faRulerCombined} />
      </button>
    </div>
  );
};

export default TimelineControls;
