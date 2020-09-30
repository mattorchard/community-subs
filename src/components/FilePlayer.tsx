import React from "react";
import useObjectUrl from "../hooks/useObjectUrl";
import Spinner from "./Spinner";
import useAsyncValue from "../hooks/useAsyncValue";
import { getFile } from "../repositories/EntityRepository";
import { Alert } from "./Alert";

const useFile = (fileId: string) =>
  useAsyncValue(() => getFile(fileId), [fileId]);

const FilePlayer = React.forwardRef<HTMLVideoElement, { id: string }>(
  ({ id }, ref) => {
    const { result: file, loading, error } = useFile(id);
    const objectUrl = useObjectUrl(file?.file);
    if (loading || !objectUrl) {
      return <Spinner />;
    }
    if (error) {
      return (
        <Alert
          type="error"
          heading="Failed to load video"
          description={error.message}
        />
      );
    }
    return <video ref={ref} controls src={objectUrl} />;
  }
);

export default FilePlayer;
