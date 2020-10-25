import React from "react";
import IconButton from "./IconButton";
import {
  faMapMarkerAlt,
  faObjectUngroup,
} from "@fortawesome/free-solid-svg-icons";
import "./ScrollControls.css";
import {
  useScrollToPlayhead,
  useScrollToSelection,
} from "../contexts/StudioScrollContext";
import useShortcut from "../hooks/useShortcut";

const ScrollControls = () => {
  const scrollToPlayhead = useScrollToPlayhead();
  const scrollToSelection = useScrollToSelection();

  useShortcut("p", scrollToPlayhead, { shift: true });
  useShortcut("s", scrollToPlayhead, { shift: true });

  return (
    <div role="group" className="scroll-controls button-group with-dividers">
      <IconButton
        title="Scroll to Playhead (shift + P)"
        icon={faMapMarkerAlt}
        onClick={scrollToPlayhead}
      />
      <IconButton
        title="Scroll to Selection (shift + S)"
        icon={faObjectUngroup}
        onClick={scrollToSelection}
      />
    </div>
  );
};

export default ScrollControls;
