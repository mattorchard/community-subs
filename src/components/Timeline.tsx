import React, { CSSProperties, useCallback } from "react";
import "./Timeline.css";
import { Cue } from "../types/subtitles";
import useWindowEvent from "../hooks/useWindowEvent";
import { CueMap, CueUpdate } from "../hooks/useCues";
import TimelineMarkers from "./TimelineMarkers";
import { v4 as uuidV4 } from "uuid";

type DragDetails = {
  id: string;
  start: boolean;
  end: boolean;
  min?: number;
  max?: number;
};

const useTimelinePointerX = (onPointerXChange: (x: number) => void) => {
  const clientXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);

  const onPointerMove = React.useCallback(
    (event: React.MouseEvent) => {
      clientXRef.current = event.clientX;
      onPointerXChange(scrollLeftRef.current + clientXRef.current);
    },
    [onPointerXChange]
  );

  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      scrollLeftRef.current = event.currentTarget.scrollLeft;
      onPointerXChange(scrollLeftRef.current + clientXRef.current);
    },
    [onPointerXChange]
  );

  return {
    onPointerMove,
    onScroll,
  };
};

const Timeline: React.FC<{
  duration: number;
  scale: number;
  cues: CueMap;
  saveCue: (cue: CueUpdate) => void;
}> = ({ duration, scale, cues, saveCue }) => {
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const pointerXRef = React.useRef<number>(0);
  const [dragDetails, setDraggingDetails] = React.useState<DragDetails | null>(
    null
  );

  const containerProps = useTimelinePointerX(
    useCallback((rawX) => {
      const x = rawX - 200; // Bumper width
      pointerXRef.current = x;
      timelineRef.current?.style.setProperty("--pointer-x", x.toString());
    }, [])
  );

  const addCue = (time: number) =>
    saveCue({
      id: uuidV4(),
      lines: [],
      start: time,
      end: time + 2500,
    });

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

  return (
    <div
      {...containerProps}
      ref={timelineRef}
      className={`timeline ${dragDetails && "timeline--is-dragging"}`}
    >
      <div className="timeline__bumper" />
      <section
        className="timeline__content"
        onDoubleClick={() => addCue(pointerXRef.current / scale)}
        style={
          {
            "--timeline-duration": duration,
            "--timeline-scale": scale,
          } as CSSProperties
        }
      >
        <TimelineMarkers duration={duration} scale={scale} />
        {[...cues.values()].map((cue) => (
          <TimelineCue
            key={cue.id}
            cue={cue}
            dragDetails={cue.id === dragDetails?.id ? dragDetails : null}
            onDragStart={setDraggingDetails}
          />
        ))}
        <div className="play-head" />
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
    <a
      className="timeline-cue__body"
      title={cue.lines.join("\n")}
      href={`#${cue.id}`}
    >
      {cue.lines[0] || <em>Blank</em>}
    </a>
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
