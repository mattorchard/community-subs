import React, { useState } from "react";
import useControlScroll from "../hooks/useControlScroll";
import { faSearchMinus, faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ZoomRange.css";

const MIN = -2;
const MAX = 0;
const STEP = 0.1;

const ZoomRange: React.FC<{
  zoom: number;
  onZoomChange: (zoom: number) => void;
}> = ({ zoom, onZoomChange }) => {
  const [value, setRawValue] = useState(() => Math.log10(zoom));

  const setValue = (value: number) => {
    setRawValue(value);
    onZoomChange(Math.pow(10, value));
  };

  useControlScroll((scrollDelta) => setValue(value + scrollDelta / 1000));

  return (
    <div className="zoom-range" title="Timeline zoom" role="group">
      <button
        title="Zoom out"
        onClick={() => setValue(Math.max(MIN, value - STEP))}
      >
        <FontAwesomeIcon icon={faSearchMinus} />
      </button>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        onChange={(event) => setValue(Number(event.currentTarget.value))}
      />
      <button
        title="Zoom in"
        onClick={() => setValue(Math.min(MAX, value + STEP))}
      >
        <FontAwesomeIcon icon={faSearchPlus} />
      </button>
    </div>
  );
};

export default ZoomRange;
