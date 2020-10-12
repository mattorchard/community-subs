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
import TimelineCue from "./TimelineCue";
import { useLiveCallback } from "../hooks/useLiveCallback";
import { useToolsContext } from "../contexts/ToolsContext";
import { clamp } from "../helpers/algoHelpers";

export type CueDragType = "start" | "end" | "both";
export type CueDragDetails = {
  id: string;
  type: CueDragType;
  start: number;
  end: number;
  offset: number;
};

export type SelectionActions = "replace" | "add" | "remove";

const useTimelinePointerX = (
  onPointerXChange: (x: number, scrollX: number, pointerX: number) => void
) => {
  const clientXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const onPointerXChangeLive = useLiveCallback(onPointerXChange);

  const onPointerMove = useCallback(
    (event: React.MouseEvent) => {
      clientXRef.current = event.clientX;
      onPointerXChangeLive(
        scrollLeftRef.current + clientXRef.current,
        scrollLeftRef.current,
        clientXRef.current
      );
    },
    [onPointerXChangeLive]
  );

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      scrollLeftRef.current = event.currentTarget.scrollLeft;
      onPointerXChangeLive(
        scrollLeftRef.current + clientXRef.current,
        scrollLeftRef.current,
        clientXRef.current
      );
    },
    [onPointerXChangeLive]
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

const roundToGrid = (value: number, scale: number) => {
  const roundToNearest = 2.5 / scale;
  return Math.round(value / roundToNearest) * roundToNearest;
};

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
  const { isSnapToGridEnabled } = useToolsContext();

  const timelineRef = useRef<HTMLDivElement>(null!);
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

  const containerProps = useTimelinePointerX((rawX, scrollX) => {
    const x = rawX - 200; // Bumper width
    const xGrid = roundToGrid(x, scale);

    pointerXRef.current = x;
    timelineRef.current.style.setProperty("--pointer-x", x.toString());
    timelineRef.current.style.setProperty("--pointer-x-grid", xGrid.toString());
    if (cueDragDetails) {
      timelineRef.current.style.setProperty(
        "--pointer-x-grid-offset",
        roundToGrid(x - cueDragDetails.offset, scale).toString()
      );
    }
    setScrollX(scrollX);
  });

  const handleDragStart = (dragDetails: CueDragDetails) => {
    timelineRef.current.style.setProperty(
      "--pointer-x-grid-offset",
      roundToGrid(pointerXRef.current - dragDetails.offset, scale).toString()
    );
    setCueDraggingDetails(dragDetails);
  };

  // Maintain approximate scroll position through scale changes
  const lastScaleRef = useRef(scale);
  useEffect(() => {
    const scaleRatio = scale / lastScaleRef.current;
    timelineRef.current.scrollLeft *= scaleRatio;
    lastScaleRef.current = scale;
  }, [scale]);

  const handleDragStop = () => {
    setIsPanning(false);
    setIsSeeking(false);
    if (!cueDragDetails) {
      return;
    }
    setCueDraggingDetails(null);

    const minDuration = 250;
    const minDragAmount = 1;
    const { id, offset, type } = cueDragDetails;
    const timelinePosition = isSnapToGridEnabled
      ? roundToGrid(pointerXRef.current, scale) / scale
      : pointerXRef.current / scale;

    const maximumStart = isSnapToGridEnabled
      ? roundToGrid(cueDragDetails.end - minDuration, scale)
      : cueDragDetails.end - minDuration;

    const minimumEnd = isSnapToGridEnabled
      ? roundToGrid(cueDragDetails.start + minDuration, scale)
      : cueDragDetails.start + minDuration;

    switch (type) {
      case "start":
        if (
          Math.abs(cueDragDetails.start - timelinePosition) >= minDragAmount
        ) {
          const start = Math.min(maximumStart, timelinePosition);
          updateCue({ id, start: clamp(start, 0, duration) });
        }
        break;

      case "end":
        if (Math.abs(cueDragDetails.end - timelinePosition) >= minDragAmount) {
          const end = Math.max(minimumEnd, timelinePosition);
          updateCue({ id, end: clamp(end, 0, duration) });
        }
        break;

      case "both":
        const start = Math.max(
          0,
          isSnapToGridEnabled
            ? roundToGrid(pointerXRef.current - offset, scale) / scale
            : (pointerXRef.current - offset) / scale
        );

        const cueDuration = cueDragDetails.end - cueDragDetails.start;
        const end = start + cueDuration;

        if (Math.abs(cueDragDetails.start - start) >= minDragAmount) {
          updateCue({
            id,
            start: clamp(start, 0, duration),
            end: clamp(end, 0, duration),
          });
        }
        break;
    }
  };

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
        "snap-to-grid": isSnapToGridEnabled,
        "is-dragging": cueDragDetails,
        "is-dragging-both": cueDragDetails?.type === "both",
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
                timelineRef.current.scrollLeft -= event.movementX;
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
                  onDragStart={handleDragStart}
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

export default Timeline;
