import React, { useState } from "react";
import {
  Project,
  ProjectUpdate,
  updateProject,
} from "../repositories/ProjectRepository";
import "./ProjectOverview.css";
import DebouncedInput from "./DebouncedInput";
import { toDateTimeString } from "../helpers/dateHelpers";
import AddVideoForm from "./AddVideoForm";
import TranscriptList from "./TranscriptList";
import Thumbnail from "./Thumbnail";
import FileDropTarget from "./FileDropTarget";

const ProjectOverview: React.FC<{ project: Project }> = ({
  project: initialProject,
}) => {
  const [project, setProject] = useState(initialProject);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProject = async (projectUpdate: ProjectUpdate) => {
    try {
      setIsSaving(true);
      const project = await updateProject(projectUpdate);
      setProject(project);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="project-overview">
      <header className="project-overview__header">
        {project.video?.thumbnailUrl && (
          <Thumbnail url={project.video?.thumbnailUrl} />
        )}

        <div className="project-overview__header__content_info">
          <DebouncedInput
            initialValue={project.name}
            disabled={isSaving}
            onValueChange={(name) =>
              handleUpdateProject({ id: project.id, name })
            }
            className="project-overview__name-input"
          />
          <time
            className="project-overview__created-at"
            dateTime={project.createdAt.toISOString()}
          >
            {toDateTimeString(project.createdAt)}
          </time>
        </div>
      </header>
      <main>
        {project.video ? (
          <div>
            {/*Todo: Add video details*/}
            {/*Todo: Add import option*/}
            {<TranscriptList projectId={project.id} />}
            <FileDropTarget
              buttonLabel="Choose a file to import"
              dropLabel="Or drag and drop one"
              onDrop={console.log}
            />
          </div>
        ) : (
          <AddVideoForm
            projectId={project.id}
            onSubmit={(video) => handleUpdateProject({ id: project.id, video })}
          />
        )}
      </main>
    </div>
  );
};

export default ProjectOverview;
