import React from "react";

const ZoomRange: React.FC<{
  zoom: number;
  onZoomChange: (zoom: number) => void;
}> = ({ zoom, onZoomChange }) => {
  const [value, setValue] = React.useState(() => Math.log10(zoom));

  const setBothValues = (value: number) => {
    setValue(value);
    onZoomChange(Math.pow(10, value));
  };

  return (
    <label>
      Zoom
      <span>
        -
        <input
          type="range"
          min={-4}
          max={2}
          step={0.1}
          value={value}
          onChange={(event) => setBothValues(Number(event.currentTarget.value))}
        />
        +
      </span>
    </label>
  );
};

export default ZoomRange;
