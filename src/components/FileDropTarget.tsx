import React, { useEffect, useRef } from "react";
import { getClassName } from "../helpers/domHelpers";
import useFileDrop from "../hooks/useFileDrop";
import "./FileDropTarget.css";
import Button from "./Button";

const FileDropTarget: React.FC<{
  buttonLabel: string;
  dropLabel: string;
  onDrop: (files: File[]) => void;
  accept?: string;
}> = ({ buttonLabel, dropLabel, accept, onDrop }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDraggingOver = useFileDrop(onDrop);

  useEffect(() => {
    if (contentRef.current) {
      const bounds = contentRef.current.getBoundingClientRect();
      const style = contentRef.current.style;
      style.setProperty("--initial-x", `${bounds.left}px`);
      style.setProperty("--initial-y", `${bounds.top}px`);
      style.setProperty("--initial-width", `${bounds.width}px`);
      style.setProperty("--initial-height", `${bounds.height}px`);
    }
  }, [isDraggingOver]);

  return (
    <div className="file-drop-target xl">
      <div
        ref={contentRef}
        className={getClassName("file-drop-target__content", {
          dragging: isDraggingOver,
        })}
      >
        <Button onClick={() => fileInputRef.current?.click()}>
          {buttonLabel}
        </Button>
        <input
          accept={accept}
          ref={fileInputRef}
          hidden
          aria-label={buttonLabel}
          type="file"
          onChange={(event) => {
            if (event.currentTarget.files) {
              onDrop([...event.currentTarget.files]);
            }
          }}
        />
        <div className="file-drop-target__drop-label">{dropLabel}</div>
      </div>
    </div>
  );
};

export default FileDropTarget;
