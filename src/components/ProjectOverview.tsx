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

const ProjectOverview: React.FC<{ project: Project; onClose: () => void }> = ({
  project: initialProject,
  onClose,
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
        <a
          href="#welcome"
          onClick={onClose}
          title="Close Project"
          className="project-overview__close-button xl"
        >
          &times;
        </a>
        <DebouncedInput
          initialValue={project.name}
          disabled={isSaving}
          onValueChange={(name) =>
            handleUpdateProject({ id: project.id, name })
          }
          className="project-overview__name-input xl"
        />
        <time
          className="project-overview__created-at"
          dateTime={project.createdAt.toISOString()}
        >
          {toDateTimeString(project.createdAt)}
        </time>
      </header>
      <main>
        {project.video ? (
          <div>
            {/*Todo: Add video details*/}
            {/*Todo: Add cue list selection*/}
            {/*Todo: Add import option*/}
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
