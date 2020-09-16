import React from "react";
import useObjectUrl from "../hooks/useObjectUrl";
import Spinner from "./Spinner";
import { useFile } from "../hooks/ProjectRepositoryHooks";

const BlobPlayer: React.FC<{ blob: Blob }> = ({ blob }) => {
  const objectUrl = useObjectUrl(blob);
  if (!objectUrl) {
    return <Spinner fadeIn />;
  }
  return <video controls src={objectUrl} />;
};

const FilePlayer: React.FC<{ id: string }> = ({ id }) => {
  const { file, loading, error } = useFile(id);
  if (loading) {
    return <Spinner />;
  }
  if (error || !file) {
    // Todo: Error
    console.error("Failed to get file", error);
    return <p>Unable to get file</p>;
  }
  return <BlobPlayer blob={file} />;
};

export default FilePlayer;
