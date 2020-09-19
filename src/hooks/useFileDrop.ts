import useWindowEvent from "./useWindowEvent";
import { useRef, useState } from "react";

const isDraggingFiles = (event: DragEvent) =>
  event.dataTransfer?.types?.some((type) => type.toLowerCase() === "files");

const useFileDrop = (onDrop: (files: File[]) => void) => {
  const leaveTimeoutRef = useRef<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useWindowEvent(
    "dragenter",
    (event) => {
      if (isDraggingFiles(event as DragEvent)) {
        event.preventDefault();
        if (leaveTimeoutRef.current) {
          window.clearTimeout(leaveTimeoutRef.current);
        }
        setIsDraggingOver(true);
      }
    },
    []
  );
  useWindowEvent(
    "dragover",
    (event) => {
      if (isDraggingFiles(event as DragEvent)) {
        event.preventDefault();
      }
    },
    []
  );
  useWindowEvent(
    "dragleave",
    (event) => {
      if (isDraggingFiles(event as DragEvent)) {
        leaveTimeoutRef.current = window.setTimeout(
          () => setIsDraggingOver(false),
          100
        );
      }
    },
    []
  );
  useWindowEvent(
    "dragover",
    (event) => {
      if (leaveTimeoutRef.current && isDraggingFiles(event as DragEvent)) {
        window.clearTimeout(leaveTimeoutRef.current);
      }
    },
    []
  );
  useWindowEvent(
    "drop",
    (event) => {
      if (isDraggingFiles(event as DragEvent)) {
        event.preventDefault();
        setIsDraggingOver(false);
        const fileList = (event as DragEvent).dataTransfer?.files;
        if (fileList && fileList.length > 0) {
          onDrop([...fileList]);
        }
      }
    },
    []
  );

  return isDraggingOver;
};

export default useFileDrop;
