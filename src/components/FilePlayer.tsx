import React from "react";
import useObjectUrl from "../hooks/useObjectUrl";
import Spinner from "./Spinner";
import { useFile } from "../hooks/ProjectRepositoryHooks";

const FilePlayer = React.forwardRef<HTMLVideoElement, { id: string }>(
  ({ id }, ref) => {
    const { file, loading, error } = useFile(id);
    const objectUrl = useObjectUrl(file || undefined);
    if (loading || !objectUrl) {
      return <Spinner />;
    }
    if (error || !file) {
      // Todo: Error
      console.error("Failed to get file", error);
      return <p>Unable to get file</p>;
    }
    return <video ref={ref} controls src={objectUrl} />;
  }
);

export default FilePlayer;
