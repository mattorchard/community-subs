import React from "react";
import { ProjectVideo } from "../repositories/ProjectRepository";
import AddYoutubeVideoForm from "./AddYouTubeVideoForm";
import { Alert } from "./Alert";
import AddUploadVideoForm from "./AddUploadVideoForm";
import "./AddVideoForm.css";

const AddVideoForm: React.FC<{
  projectId: string;
  onSubmit: (video: ProjectVideo) => void;
}> = ({ onSubmit, projectId }) => {
  return (
    <form className="add-video-form" onSubmit={(e) => e.preventDefault()}>
      <Alert
        heading={<h2>New Project</h2>}
        description="Add a video to your new project either from YouTube or by uploading in the area below"
      />
      <AddYoutubeVideoForm onSubmit={onSubmit} />
      <AddUploadVideoForm projectId={projectId} onSubmit={onSubmit} />
    </form>
  );
};

export default AddVideoForm;
