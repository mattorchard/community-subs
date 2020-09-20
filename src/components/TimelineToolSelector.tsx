import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faForward,
  faHandPaper,
  faPlusSquare,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { getClassName } from "../helpers/domHelpers";
import "./TimelineToolSelector.css";
import { TimelineTool } from "./Studio";

type TimelineItem = { title: string; icon: IconDefinition; tool: TimelineTool };
const items: TimelineItem[] = [
  {
    title: "Pan timeline",
    tool: "pan",
    icon: faHandPaper,
  },
  {
    title: "Add cues",
    tool: "add",
    icon: faPlusSquare,
  },
  {
    title: "Seek video",
    tool: "seek",
    icon: faForward,
  },
];

const TimelineToolSelector: React.FC<{
  selected: TimelineTool;
  onSelectionChange: (tool: TimelineTool) => void;
}> = React.memo(({ selected, onSelectionChange }) => (
  <div className="timeline-tool-selector">
    {items.map(({ tool, icon, title }) => (
      <label
        key={tool}
        title={title}
        className={getClassName(
          "timeline-tool-selector__label",
          {
            selected: tool === selected,
          },
          "button"
        )}
      >
        <input
          type="radio"
          name="timelineToolSelector"
          value={tool}
          checked={tool === selected}
          onChange={(event) => {
            if (event.currentTarget.checked) {
              onSelectionChange(tool);
            }
          }}
        />
        <FontAwesomeIcon icon={icon} />
      </label>
    ))}
  </div>
));

export default TimelineToolSelector;
