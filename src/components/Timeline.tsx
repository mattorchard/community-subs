import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Cue } from "../types/cue";
import useWindowEvent from "../hooks/useWindowEvent";
import { SetCue } from "../hooks/useCues";
import { getClassName } from "../helpers/domHelpers";
import useTimelineMarkerSpacing from "../helpers/useTimelineMarkerSpacing";
import "./Timeline.css";
import useBounds from "../hooks/useBounds";

type CueDragType = "start" | "end" | "both";
type CueDragDetails = {
  id: string;
  type: CueDragType;
  start: number;
  end: number;
  offset: number;
};

const useTimelinePointerX = (
  onPointerXChange: (x: number, scrollX: number, pointerX: number) => void
) => {
  const clientXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onPointerMove = useCallback(
    (event: React.MouseEvent) => {
      clientXRef.current = event.clientX;
      onPointerXChange(
        scrollLeftRef.current + clientXRef.current,
        scrollLeftRef.current,
        clientXRef.current
      );
    },
    [onPointerXChange]
  );

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      scrollLeftRef.current = event.currentTarget.scrollLeft;
      onPointerXChange(
        scrollLeftRef.current + clientXRef.current,
        scrollLeftRef.current,
        clientXRef.current
      );
    },
    [onPointerXChange]
  );

  return {
    onPointerMove,
    onScroll,
  };
};

const isWithinView = (
  { start, width, scale }: { start: number; width: number; scale: number },
  cue: Cue
) => {
  if (cue.end * scale < start) {
    return false;
  } else if (cue.start * scale > start + width) {
    return false;
  }
  return true;
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
  onSeek: (time: number) => void;
}> = ({ duration, scale, cues, setCue, onSelectCue, onSeek }) => {
  const markerSpacing = useTimelineMarkerSpacing(scale);
  const layers = useCueLayers(cues);

  const timelineRef = useRef<HTMLDivElement>(null);
  const pointerXRef = useRef<number>(0);
  const hoveredLayerIdRef = useRef<number>(0);

  const [scrollX, setScrollX] = useState(0);
  const { width: timelineWidth } = useBounds(timelineRef);

  const [
    cueDragDetails,
    setCueDraggingDetails,
  ] = useState<CueDragDetails | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const containerProps = useTimelinePointerX(
    useCallback((rawX, scrollX) => {
      const x = rawX - 200; // Bumper width
      pointerXRef.current = x;
      timelineRef.current?.style.setProperty("--pointer-x", x.toString());
      setScrollX(scrollX);
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
    if (cueDragDetails) {
      const timelinePosition = Math.round(pointerXRef.current / scale);
      switch (cueDragDetails.type) {
        case "both":
          const offsetPosition = Math.round(cueDragDetails.offset / scale);
          const start = timelinePosition - offsetPosition;
          const end = start + (cueDragDetails.end - cueDragDetails.start);
          setCue({ id: cueDragDetails.id, start, end });
          break;
        case "start":
          setCue({ id: cueDragDetails.id, start: timelinePosition });
          break;
        case "end":
          setCue({ id: cueDragDetails.id, end: timelinePosition });
          break;
      }
      setCueDraggingDetails(null);
    }
    setIsPanning(false);
    setIsSeeking(false);
  }, [cueDragDetails, scale, setCue]);

  useWindowEvent("pointerup", handleDragStop);
  useWindowEvent("pointerleave", handleDragStop);

  const onPointerEnterLayer = useCallback(
    ({ currentTarget }) => {
      const layerId = parseInt(currentTarget.dataset.layerId!);
      hoveredLayerIdRef.current = layerId;
      if (cueDragDetails) {
        setCue({ id: cueDragDetails.id, layer: layerId });
      }
    },
    [cueDragDetails, setCue]
  );

  const addCue = (time: number) =>
    setCue({
      layer: hoveredLayerIdRef.current,
      text: "",
      start: time,
      end: time + 2500,
    });

  const viewportDetails = {
    start: scrollX - 200, // Bumper width
    width: timelineWidth,
    scale,
  };

  return (
    <div
      {...containerProps}
      ref={timelineRef}
      className={getClassName("timeline", {
        "is-dragging": cueDragDetails,
        "is-dragging-both": cueDragDetails?.start && cueDragDetails.end,
        "is-panning": isPanning,
        "is-seeking": isSeeking,
      })}
    >
      <div className="timeline__bumper" />
      <section
        className="timeline__content"
        onDoubleClick={(event) => {
          if (isTargetBackground(event)) {
            addCue(pointerXRef.current / scale);
          }
        }}
        onPointerDown={(event) => {
          if (event.shiftKey) {
            setIsPanning(true);
          } else if (isTargetBackground(event)) {
            setIsSeeking(true);
          }
        }}
        onPointerMove={
          isPanning
            ? (event) => {
                timelineRef.current!.scrollLeft -= event.movementX;
              }
            : undefined
        }
        onPointerUp={() => {
          if (isSeeking) {
            onSeek(pointerXRef.current / scale);
          }
          setIsPanning(false);
          setIsSeeking(false);
        }}
        style={
          {
            "--timeline-duration": duration,
            "--timeline-scale": scale,
            "--offset-x": cueDragDetails?.offset,
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
            {layerContents.map((cue) =>
              isWithinView(viewportDetails, cue) ? (
                <TimelineCue
                  key={cue.id}
                  cue={cue}
                  dragDetails={
                    cue.id === cueDragDetails?.id ? cueDragDetails : null
                  }
                  onDragStart={setCueDraggingDetails}
                  onSelect={onSelectCue}
                />
              ) : null
            )}
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
  onDragStart: (dragDetails: CueDragDetails) => void;
  onSelect: (cueId: string) => void;
  dragDetails: CueDragDetails | null;
}> = React.memo(
  ({ cue, dragDetails, onDragStart, onSelect }) => {
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
          if (event.shiftKey) {
            return;
          }
          event.preventDefault();
          const target = event.target as HTMLElement;
          const type = target.dataset?.dragType as CueDragType | undefined;
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
  },
  (a, b) => a.cue === b.cue && a.dragDetails === b.dragDetails
);

export default Timeline;
