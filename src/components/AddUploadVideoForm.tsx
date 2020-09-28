import React, { useMemo, useState } from "react";
import FileDropTarget from "./FileDropTarget";
import {
  getSupportedVideoTypes,
  getVideoFileDetails,
} from "../helpers/videoHelpers";
import { getFileExtension } from "../helpers/fileHelpers";
import { ProjectVideo, saveFile } from "../repositories/ProjectRepository";
import "./AddUploadVideoForm.css";

const AddUploadVideoForm: React.FC<{
  projectId: string;
  onSubmit: (video: ProjectVideo) => void;
}> = ({ projectId, onSubmit }) => {
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
            const { id: fileId } = await saveFile(projectId, file);
            onSubmit({
              ...details,
              type: "upload",
              fileId,
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
