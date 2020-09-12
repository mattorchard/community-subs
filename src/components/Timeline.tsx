import React, { CSSProperties, useCallback } from "react";
import "./Timeline.css";
import { Cue } from "../types/subtitles";
import useWindowEvent from "../hooks/useWindowEvent";
import { SaveCue } from "../hooks/useCues";
import TimelineMarkers from "./TimelineMarkers";
import { getClassName, isInteractableElement } from "../helpers/domHelpers";

type DragType = "start" | "end" | "both";
type DragDetails = {
  id: string;
  type: DragType;
  start: number;
  end: number;
  offset: number;
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
  cues: Cue[];
  saveCue: SaveCue;
}> = ({ duration, scale, cues, saveCue }) => {
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const pointerXRef = React.useRef<number>(0);
  const [dragDetails, setDraggingDetails] = React.useState<DragDetails | null>(
    null
  );
  const [hoveredLayerId, setHoveredLayerId] = React.useState<number | null>(
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
      layer: hoveredLayerId || 0,
      lines: [],
      start: time,
      end: time + 2500,
    });

  const handleDragStop = React.useCallback(() => {
    if (dragDetails) {
      const timelinePosition = Math.round(pointerXRef.current / scale);
      switch (dragDetails.type) {
        case "both":
          const offsetPosition = Math.round(dragDetails.offset / scale);
          const start = timelinePosition - offsetPosition;
          const end = start + (dragDetails.end - dragDetails.start);
          saveCue({ id: dragDetails.id, start, end });
          break;
        case "start":
          saveCue({ id: dragDetails.id, start: timelinePosition });
          break;
        case "end":
          saveCue({ id: dragDetails.id, end: timelinePosition });
          break;
      }
      setDraggingDetails(null);
    }
  }, [dragDetails, scale, saveCue]);

  useWindowEvent("pointerup", handleDragStop, [handleDragStop]);
  useWindowEvent("pointerleave", handleDragStop, [handleDragStop]);

  const layers = React.useMemo(() => {
    const layers: Cue[][] = new Array(3).fill(null).map(() => []);
    cues.forEach((cue) => layers[cue.layer].push(cue));
    return layers;
  }, [cues]);

  return (
    <div
      {...containerProps}
      ref={timelineRef}
      className={`timeline ${dragDetails && "timeline--is-dragging"}`}
    >
      <div className="timeline__bumper" />
      <section
        className="timeline__content"
        onDoubleClick={(event) => {
          if (
            event.target instanceof HTMLElement &&
            !isInteractableElement(event.target)
          ) {
            addCue(pointerXRef.current / scale);
          }
        }}
        style={
          {
            "--timeline-duration": duration,
            "--timeline-scale": scale,
            "--offset-x": dragDetails?.offset,
          } as CSSProperties
        }
      >
        {layers.map((layerContents, index) => (
          <div
            key={index}
            className="timeline__layer"
            data-layer-id={index}
            onPointerEnter={({ currentTarget }) => {
              const layerId = parseInt(currentTarget.dataset.layerId!);
              if (layerId !== hoveredLayerId) {
                setHoveredLayerId(layerId);
              }
            }}
          >
            {layerContents.map((cue) => (
              <TimelineCue
                key={cue.id}
                cue={cue}
                dragDetails={cue.id === dragDetails?.id ? dragDetails : null}
                onDragStart={setDraggingDetails}
              />
            ))}
          </div>
        ))}
        <TimelineMarkers duration={duration} scale={scale} />
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
}> = ({ cue, dragDetails, onDragStart }) => {
  return (
    <div
      className={
        dragDetails
          ? getClassName("timeline-cue", {
              "dragging-start": dragDetails.type === "start",
              "dragging-end": dragDetails.type === "end",
              "dragging-both": dragDetails.type === "both",
            })
          : "timeline-cue"
      }
      style={
        {
          "--cue-start": cue.start,
          "--cue-end": cue.end,
          "--cue-duration": cue.end - cue.start,
        } as CSSProperties
      }
      data-cue-id={cue.id}
      onPointerDown={(event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const type = target.dataset.dragType as DragType | undefined;
        if (type) {
          const offset =
            event.nativeEvent.offsetX +
            (target === event.currentTarget ? 0 : target.offsetLeft);
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
      />
      <a
        className="timeline-cue__body"
        title={cue.lines.join("\n")}
        href={`#${cue.id}`}
        data-drag-type="both"
      >
        {cue.lines[0] || "Blank"}
      </a>
      <button
        type="button"
        className="timeline-cue__drag-handle"
        aria-label="Adjust end time"
        data-drag-type="end"
      />
    </div>
  );
};

export default Timeline;
