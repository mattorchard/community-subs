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

const TimelineControls = () => {
  const {
    isSnapToOthersEnabled,
    isSnapToGridEnabled,
    setIsSnapToOthersEnabled,
    setIsSnapToGridEnabled,
  } = useToolsContext();
  const scrollToPlayhead = useScrollToPlayhead();
  return (
    <div role="group" className="timeline-controls button-group with-dividers">
      <button
        title="Snap to others"
        className="icon-button timeline__toggle-button"
        aria-pressed={isSnapToOthersEnabled}
        onClick={() => setIsSnapToOthersEnabled((enabled) => !enabled)}
      >
        <FontAwesomeIcon icon={faMagnet} />
      </button>
      <button
        title="Snap to grid"
        className="icon-button timeline__toggle-button"
        aria-pressed={isSnapToGridEnabled}
        onClick={() => setIsSnapToGridEnabled((enabled) => !enabled)}
      >
        <FontAwesomeIcon icon={faRulerCombined} />
      </button>

      <button
        onClick={scrollToPlayhead}
        title="Scroll to playhead"
        className="icon-button"
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </button>
    </div>
  );
};

export default TimelineControls;
