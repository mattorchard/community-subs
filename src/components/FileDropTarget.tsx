import React, { useEffect, useRef } from "react";
import { getClassName } from "../helpers/domHelpers";
import useFileDrop from "../hooks/useFileDrop";
import "./FileDropTarget.css";

const FileDropTarget: React.FC<{
  label: string;
  labelWhileDragging?: string;
}> = ({ label, labelWhileDragging }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isDraggingOver = useFileDrop(console.log);

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
        {isDraggingOver ? label : labelWhileDragging || label}
      </div>
    </div>
  );
};

export default FileDropTarget;
