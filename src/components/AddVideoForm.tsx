import React from "react";
import { VideoMeta } from "../types/cue";
import AddYoutubeVideoForm from "./AddYouTubeVideoForm";
import { Alert } from "./Alert";
import AddUploadVideoForm from "./AddUploadVideoForm";
import "./AddVideoForm.css";

const AddVideoForm: React.FC<{
  onSubmit: (video: VideoMeta) => void;
}> = ({ onSubmit }) => {
  return (
    <form className="add-video-form" onSubmit={(e) => e.preventDefault()}>
      <Alert
        heading={<h2>New Transcript</h2>}
        description="Add a video to your new transcript either from YouTube or by uploading in the area below"
      />
      <AddYoutubeVideoForm onSubmit={onSubmit} />
      <AddUploadVideoForm onSubmit={onSubmit} />
      {/* Todo: Reuse video option */}
    </form>
  );
};

export default AddVideoForm;
