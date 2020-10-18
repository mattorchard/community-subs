import React, { CSSProperties } from "react";
import { Cue } from "../types/cue";
import {
  getClassName,
  getOffsetLeft,
  queryAncestor,
} from "../helpers/domHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import GroupIcon from "./GroupIcon";
import { CueDragDetails, CueDragType, SelectionActions } from "./Timeline";
import "./TimelineCue.css";

const TimelineCue: React.FC<{
  cue: Cue;
  onDragStart: (dragDetails: CueDragDetails) => void;
  isSelected: boolean;
  onSelect: (cueId: string, action: SelectionActions) => void;
  dragDetails: CueDragDetails | null;
}> = React.memo(
  ({ cue, dragDetails, onDragStart, isSelected, onSelect }) => (
    <div
      className={getClassName("timeline-cue", {
        dragging: dragDetails,
        "is-selected": isSelected,
        "is-bold": cue.isBold,
        "is-italics": cue.isItalics,
        "dragging-start": dragDetails?.type === "start",
        "dragging-end": dragDetails?.type === "end",
        "dragging-both": dragDetails?.type === "both",
      })}
      style={
        {
          "--cue-start": cue.start,
          "--cue-end": cue.end,
          "--cue-duration": cue.end - cue.start,
          "--primary-group-color": `var(--color-group-${cue.group}-primary)`,
          "--secondary-group-color": `var(--color-group-${cue.group}-secondary)`,
        } as CSSProperties
      }
      data-cue-id={cue.id}
      onPointerDown={(event) => {
        if (event.shiftKey) {
          return;
        }
        if (event.target === event.currentTarget) {
          return;
        }
        event.preventDefault();
        const target = event.target as Node;
        const type = ((target as HTMLElement).dataset?.dragType ||
          queryAncestor(target, "[data-drag-type]")?.dataset?.dragType) as
          | CueDragType
          | undefined;

        if (type) {
          const offset =
            type === "both"
              ? event.nativeEvent.offsetX + getOffsetLeft(target)
              : 0;
          onDragStart({
            type,
            id: cue.id,
            start: cue.start,
            end: cue.end,
            offset,
          });
        }
      }}
    >
      <button
        type="button"
        className="timeline-cue__drag-handle"
        aria-label="Adjust start time"
        data-drag-type="start"
      >
        <FontAwesomeIcon icon={faGripLinesVertical} />
      </button>
      <button
        onClick={(event) => {
          if (event.ctrlKey) {
            onSelect(cue.id, isSelected ? "remove" : "add");
          } else {
            onSelect(cue.id, "replace");
          }
        }}
        className="timeline-cue__body"
        title={cue.text}
        data-drag-type="both"
      >
        <span className="timeline-cue__body__text ellipses">
          {cue.text || "Blank"}
        </span>
        <GroupIcon className="timeline-cue__group" groupName={cue.group} />
      </button>
      <button
        type="button"
        className="timeline-cue__drag-handle"
        aria-label="Adjust end time"
        data-drag-type="end"
      >
        <FontAwesomeIcon icon={faGripLinesVertical} />
      </button>
    </div>
  ),
  (a, b) =>
    a.cue === b.cue &&
    a.dragDetails === b.dragDetails &&
    a.isSelected === b.isSelected
);

export default TimelineCue;
