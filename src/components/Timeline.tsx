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
import { getClassName } from "../helpers/domHelpers";
import useTimelineMarkerSpacing from "../helpers/useTimelineMarkerSpacing";
import "./Timeline.css";
import useBounds from "../hooks/useBounds";
import {
  useCueSelection,
  useCueSelectionActions,
} from "../contexts/CueSelectionContext";
import { useSeekTo } from "../contexts/PlayerControlsContext";
import { useCuesContext } from "../contexts/CuesContext";

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
}> = ({ duration, scale }) => {
  const { cues, updateCue, createCue } = useCuesContext();
  const markerSpacing = useTimelineMarkerSpacing(scale);
  const layers = useCueLayers(cues);
  const cueSelection = useCueSelection();
  const selectionActions = useCueSelectionActions();
  const seekTo = useSeekTo();

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
      const minDragAmount = 0.01;
      switch (cueDragDetails.type) {
        case "both":
          const offsetPosition = Math.round(cueDragDetails.offset / scale);
          const start = timelinePosition - offsetPosition;
          const end = start + (cueDragDetails.end - cueDragDetails.start);

          // No-need to check start and end, since both moved together
          if (Math.abs(cueDragDetails.end - end) > minDragAmount) {
            updateCue({ id: cueDragDetails.id, start, end });
          }
          break;
        case "start":
          if (
            Math.abs(cueDragDetails.start - timelinePosition) > minDragAmount
          ) {
            updateCue({ id: cueDragDetails.id, start: timelinePosition });
          }
          break;
        case "end":
          if (Math.abs(cueDragDetails.end - timelinePosition) > minDragAmount) {
            updateCue({ id: cueDragDetails.id, end: timelinePosition });
          }
          break;
      }
      setCueDraggingDetails(null);
    }
    setIsPanning(false);
    setIsSeeking(false);
  }, [cueDragDetails, scale, updateCue]);

  useWindowEvent("pointerup", handleDragStop);
  useWindowEvent("pointerleave", handleDragStop);

  const onPointerEnterLayer = useCallback(
    ({ currentTarget }) => {
      const layerId = parseInt(currentTarget.dataset.layerId!);
      hoveredLayerIdRef.current = layerId;
      if (cueDragDetails) {
        updateCue({ id: cueDragDetails.id, layer: layerId });
      }
    },
    [cueDragDetails, updateCue]
  );

  const addCue = (time: number) =>
    createCue({
      layer: hoveredLayerIdRef.current,
      start: time,
      end: time + 2500,
    });

  const viewportDetails = {
    start: scrollX - 200, // Bumper width
    width: timelineWidth,
    scale,
  };

  const handleSelect = (cueId: string, action: SelectionActions) => {
    switch (action) {
      case "replace":
        selectionActions.setSelection(cueId);
        break;
      case "add":
        selectionActions.addToSelection(cueId);
        break;
      case "remove":
        selectionActions.removeFromSelection(cueId);
        break;
    }
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
            seekTo(pointerXRef.current / scale);
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
                  isSelected={cueSelection.has(cue.id)}
                  onSelect={handleSelect}
                  cue={cue}
                  dragDetails={
                    cue.id === cueDragDetails?.id ? cueDragDetails : null
                  }
                  onDragStart={setCueDraggingDetails}
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

type SelectionActions = "replace" | "add" | "remove";

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
        onClick={(event) => {
          if (event.ctrlKey) {
            onSelect(cue.id, isSelected ? "remove" : "add");
          } else {
            onSelect(cue.id, "replace");
          }
        }}
        className="timeline-cue__body ellipses"
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
  ),
  (a, b) =>
    a.cue === b.cue &&
    a.dragDetails === b.dragDetails &&
    a.isSelected === b.isSelected
);

export default Timeline;
