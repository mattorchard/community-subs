import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnet,
  faMapMarkerAlt,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import "./TimelineControls.css";
import { useToolsContext } from "../contexts/ToolsContext";
import { useScrollToPlayhead } from "../contexts/StudioScrollContext";
import useShortcut from "../hooks/useShortcut";

const TimelineControls = () => {
  const {
    isSnapToOthersEnabled,
    isSnapToGridEnabled,
    setIsSnapToOthersEnabled,
    setIsSnapToGridEnabled,
  } = useToolsContext();
  const scrollToPlayhead = useScrollToPlayhead();

  const toggleSnapToOthers = () =>
    setIsSnapToOthersEnabled((enabled) => !enabled);
  const toggleSnapToGrid = () => setIsSnapToGridEnabled((enabled) => !enabled);

  useShortcut("p", scrollToPlayhead, { shift: true });
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

      <button
        onClick={scrollToPlayhead}
        title="Scroll to playhead (shift + P)"
        className="icon-button"
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </button>
    </div>
  );
};

export default TimelineControls;
