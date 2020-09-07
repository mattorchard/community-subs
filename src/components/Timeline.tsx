import React, { CSSProperties } from "react";
import "./Timeline.css";
import { Cue } from "../types/subtitles";
import useWindowEvent from "../hooks/useWindowEvent";
import { CueMap, CueUpdate } from "../hooks/useCues";

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
}> = ({ duration, scale, cues, saveCue }) => {
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const pointerRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragDetails, setDraggingDetails] = React.useState<DragDetails | null>(
    null
  );

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget === event.target) {
      const { offsetX: x, offsetY: y } = event.nativeEvent;
      pointerRef.current.x = x;
      pointerRef.current.y = y;
      timelineRef.current?.style.setProperty("--pointer-x", x.toString());
      timelineRef.current?.style.setProperty("--pointer-y", y.toString());
    }
  };

  useWindowEvent(
    "pointerup",
    () => {
      if (dragDetails) {
        const timelinePosition = Math.round(pointerRef.current.x / scale);
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

  return (
    <div
      ref={timelineRef}
      className={`timeline ${dragDetails && "timeline--is-dragging"}`}
    >
      <div className="timeline__bumper" />
      <section
        className="timeline__content"
        onPointerMove={handlePointerMove}
        style={
          {
            "--timeline-duration": duration,
            "--timeline-scale": scale,
          } as CSSProperties
        }
      >
        {Object.values(cues).map((cue) => (
          <TimelineCue
            key={cue.id}
            cue={cue}
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
}> = ({ cue, dragDetails, onDragStart }) => (
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
