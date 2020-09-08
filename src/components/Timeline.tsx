import React, { CSSProperties } from "react";
import "./Timeline.css";
import { Cue } from "../types/subtitles";
import useWindowEvent from "../hooks/useWindowEvent";
import { CueMap, CueUpdate } from "../hooks/useCues";
import useWindowSize from "../hooks/useWindowSize";
import TimelineMarkers from "./TimelineMarkers";
import { queryAncestor } from "../helpers/domHelpers";

type DragDetails = {
  id: string;
  start: boolean;
  end: boolean;
  min?: number;
  max?: number;
};

const Timeline: React.FC<{
  duration: number;
  scale: number;
  cues: CueMap;
  saveCue: (cue: CueUpdate) => void;
  onSelectCue: (cueId: string) => void;
}> = ({ duration, scale, cues, saveCue, onSelectCue }) => {
  const { width: windowWidth } = useWindowSize();
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const pointerXRef = React.useRef<number>(0);
  const [dragDetails, setDraggingDetails] = React.useState<DragDetails | null>(
    null
  );

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const x = event.clientX + event.currentTarget.scrollLeft - windowWidth / 2;
    pointerXRef.current = x;
    timelineRef.current?.style.setProperty("--pointer-x", x.toString());
  };

  useWindowEvent(
    "pointerup",
    () => {
      if (dragDetails) {
        const timelinePosition = Math.round(pointerXRef.current / scale);
        if (dragDetails.start) {
          saveCue({ id: dragDetails.id, start: timelinePosition });
        } else {
          saveCue({ id: dragDetails.id, end: timelinePosition });
        }
        setDraggingDetails(null);
      }
    },
    [dragDetails, scale, saveCue]
  );

  const handleCueClick = (event: React.MouseEvent) => {
    const cueElement = queryAncestor(event.target as Node, "[data-cue-id]");
    const cueId = cueElement?.dataset?.cueId;
    if (cueId) {
      onSelectCue(cueId);
    }
  };

  return (
    <div
      ref={timelineRef}
      onPointerMove={handlePointerMove}
      className={`timeline ${dragDetails && "timeline--is-dragging"}`}
    >
      <div className="timeline__bumper" />
      <section
        className="timeline__content"
        style={
          {
            "--timeline-duration": duration,
            "--timeline-scale": scale,
          } as CSSProperties
        }
      >
        <TimelineMarkers duration={duration} scale={scale} />
        {Object.values(cues).map((cue) => (
          <TimelineCue
            key={cue.id}
            cue={cue}
            onClick={handleCueClick}
            dragDetails={cue.id === dragDetails?.id ? dragDetails : null}
            onDragStart={setDraggingDetails}
          />
        ))}
      </section>
      <div className="timeline__bumper" />
    </div>
  );
};

const TimelineCue: React.FC<{
  cue: Cue;
  onDragStart: (dragDetails: DragDetails) => void;
  dragDetails: DragDetails | null;
  onClick: (event: React.MouseEvent) => void;
}> = ({ cue, dragDetails, onDragStart, onClick }) => (
  <div
    className={`timeline-cue ${
      dragDetails?.start && "timeline-cue--dragging-start"
    } ${dragDetails?.end && "timeline-cue--dragging-end"}`}
    style={
      {
        "--cue-start": cue.start,
        "--cue-end": cue.end,
      } as CSSProperties
    }
    data-cue-id={cue.id}
  >
    <button
      type="button"
      className="timeline-cue__drag-handle"
      aria-label="Adjust start time"
      onPointerDown={() =>
        onDragStart({
          id: cue.id,
          start: true,
          end: false,
          max: cue.end - 1,
        })
      }
    />
    <button
      type="button"
      className="timeline-cue__first-line"
      title={cue.lines.join("\n")}
      onClick={onClick}
    >
      {cue.lines[0] || <em>Blank</em>}
    </button>
    <button
      type="button"
      className="timeline-cue__drag-handle"
      aria-label="Adjust end time"
      onPointerDown={() =>
        onDragStart({ id: cue.id, start: false, end: true, min: cue.start + 1 })
      }
    />
  </div>
);

export default Timeline;
