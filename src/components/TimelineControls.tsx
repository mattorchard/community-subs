import React from "react";
import { faMagnet, faRulerCombined } from "@fortawesome/free-solid-svg-icons";
import "./TimelineControls.css";
import { useToolsContext } from "../contexts/ToolsContext";
import useShortcut from "../hooks/useShortcut";
import IconButton from "./IconButton";

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
      <IconButton
        title="Snap to others (shift + O)"
        icon={faMagnet}
        className="timeline__toggle-button"
        aria-pressed={isSnapToOthersEnabled}
        onClick={toggleSnapToOthers}
      />
      <IconButton
        title="Snap to grid (shift + G)"
        icon={faRulerCombined}
        className="timeline__toggle-button"
        aria-pressed={isSnapToGridEnabled}
        onClick={toggleSnapToGrid}
      />
    </div>
  );
};

export default TimelineControls;
