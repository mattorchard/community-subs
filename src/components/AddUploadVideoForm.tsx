import React, { useMemo, useState } from "react";
import FileDropTarget from "./FileDropTarget";
import {
  getSupportedVideoTypes,
  getVideoFileDetails,
} from "../helpers/videoHelpers";
import { getFileExtension } from "../helpers/fileHelpers";
import { VideoMeta } from "../types/cue";
import "./AddUploadVideoForm.css";
import { createFile } from "../repositories/EntityRepository";

const AddUploadVideoForm: React.FC<{
  onSubmit: (video: VideoMeta) => void;
}> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const supportedTypes = useMemo(() => getSupportedVideoTypes(), []);
  return (
    <div>
      <h3 className="add-upload-video-form__heading xxl">Upload</h3>
      <FileDropTarget
        isLoading={isLoading}
        errorMessage={errorMessage}
        buttonLabel="Choose a video"
        accept="video/*"
        dropLabel="Or drag and drop one"
        onDrop={async (files) => {
          const [file] = files;
          if (!file) {
            return;
          }
          const fileExtension = getFileExtension(file.name);
          if (!supportedTypes.includes(fileExtension)) {
            setErrorMessage(
              `Invalid file format, please choose a [${supportedTypes.join(
                ", "
              )}] video file`
            );
            return;
          }

          setErrorMessage(undefined);
          setIsLoading(true);

          try {
            const details = await getVideoFileDetails(file);
            const { id } = await createFile(file);
            onSubmit({
              ...details,
              id,
              type: "upload",
              name: file.name || "Unknown file",
              createdAt: new Date(),
            });
          } catch (error) {
            console.error("Failed to get video details", error);
            setErrorMessage("Failed to load video details");
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
};
export default AddUploadVideoForm;
