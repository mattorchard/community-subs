import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Cue } from "../types/subtitles";
import useWindowEvent from "../hooks/useWindowEvent";
import { SetCue } from "../hooks/useCues";
import { getClassName } from "../helpers/domHelpers";
import useTimelineMarkerSpacing from "../helpers/useTimelineMarkerSpacing";
import "./Timeline.css";

type DragType = "start" | "end" | "both";
type DragDetails = {
  id: string;
  type: DragType;
  start: number;
  end: number;
  offset: number;
};

const useTimelinePointerX = (onPointerXChange: (x: number) => void) => {
  const clientXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onPointerMove = useCallback(
    (event: React.MouseEvent) => {
      clientXRef.current = event.clientX;
      onPointerXChange(scrollLeftRef.current + clientXRef.current);
    },
    [onPointerXChange]
  );

  const onScroll = useCallback(
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

const isTargetBackground = (event: React.PointerEvent | React.MouseEvent) =>
  event.currentTarget === event.target ||
  event.currentTarget === (event.target as Node).parentElement;

const useCueLayers = (cues: Cue[]) =>
  useMemo(() => {
    const layers: Cue[][] = [[], [], []];
    cues.forEach((cue) => layers[cue.layer].push(cue));
    return layers;
  }, [cues]);

const Timeline: React.FC<{
  duration: number;
  scale: number;
  cues: Cue[];
  setCue: SetCue;
  selectedCue: string | null;
  onSelectCue: (cueId: string) => void;
}> = ({ duration, scale, cues, setCue, onSelectCue }) => {
  const markerSpacing = useTimelineMarkerSpacing(scale);
  const layers = useCueLayers(cues);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pointerXRef = useRef<number>(0);
  const hoveredLayerIdRef = useRef<number>(0);
  const [dragDetails, setDraggingDetails] = useState<DragDetails | null>(null);

  const containerProps = useTimelinePointerX(
    useCallback((rawX) => {
      const x = rawX - 200; // Bumper width
      pointerXRef.current = x;
      timelineRef.current?.style.setProperty("--pointer-x", x.toString());
    }, [])
  );

  // Maintain approximate scroll position through scale changes
  const lastScaleRef = useRef(scale);
  useEffect(() => {
    const scaleRatio = scale / lastScaleRef.current;
    timelineRef.current!.scrollLeft *= scaleRatio;
    lastScaleRef.current = scale;
  }, [scale]);

  const handleDragStop = useCallback(() => {
    if (dragDetails) {
      const timelinePosition = Math.round(pointerXRef.current / scale);
      switch (dragDetails.type) {
        case "both":
          const offsetPosition = Math.round(dragDetails.offset / scale);
          const start = timelinePosition - offsetPosition;
          const end = start + (dragDetails.end - dragDetails.start);
          setCue({ id: dragDetails.id, start, end });
          break;
        case "start":
          setCue({ id: dragDetails.id, start: timelinePosition });
          break;
        case "end":
          setCue({ id: dragDetails.id, end: timelinePosition });
          break;
      }
      setDraggingDetails(null);
    }
  }, [dragDetails, scale, setCue]);

  useWindowEvent("pointerup", handleDragStop, [handleDragStop]);
  useWindowEvent("pointerleave", handleDragStop, [handleDragStop]);

  const onPointerEnterLayer = useCallback(
    ({ currentTarget }) => {
      const layerId = parseInt(currentTarget.dataset.layerId!);
      hoveredLayerIdRef.current = layerId;
      if (dragDetails) {
        setCue({ id: dragDetails.id, layer: layerId });
      }
    },
    [dragDetails, setCue]
  );

  const addCue = (time: number) =>
    setCue({
      layer: hoveredLayerIdRef.current,
      text: "",
      start: time,
      end: time + 2500,
    });

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
          if (isTargetBackground(event)) {
            addCue(pointerXRef.current / scale);
          }
        }}
        style={
          {
            "--timeline-duration": duration,
            "--timeline-scale": scale,
            "--offset-x": dragDetails?.offset,
            "--marker-spacing": markerSpacing,
          } as CSSProperties
        }
      >
        {layers.map((layerContents, index) => (
          <div
            key={index}
            className="timeline__layer"
            data-layer-id={index}
            onPointerEnter={onPointerEnterLayer}
          >
            {layerContents.map((cue) => (
              <TimelineCue
                key={cue.id}
                cue={cue}
                dragDetails={cue.id === dragDetails?.id ? dragDetails : null}
                onDragStart={setDraggingDetails}
                onSelect={onSelectCue}
              />
            ))}
          </div>
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
  onSelect: (cueId: string) => void;
  dragDetails: DragDetails | null;
}> = ({ cue, dragDetails, onDragStart, onSelect }) => {
  return (
    <div
      className={
        dragDetails
          ? getClassName("timeline-cue", {
              dragging: dragDetails,
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
      <button
        onClick={() => onSelect(cue.id)}
        className="timeline-cue__body"
        title={cue.text}
        data-drag-type="both"
      >
        {cue.text || "Blank"}
      </button>
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
