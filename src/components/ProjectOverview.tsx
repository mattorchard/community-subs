import React from "react";
import { Project, saveProject } from "../repositories/ProjectRepository";
import "./ProjectOverview.css";
import DebouncedInput from "./DebouncedInput";
import { toDateTimeString } from "../helpers/dateHelpers";

const ProjectOverview: React.FC<{ project: Project; onClose: () => void }> = ({
  project,
  onClose,
}) => {
  return (
    <main className="project-overview">
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
          onValueChange={(name) => saveProject({ ...project, name })}
          className="project-overview__name-input xl"
        />
        <time
          className="project-overview__created-at"
          dateTime={project.createdAt.toISOString()}
        >
          {toDateTimeString(project.createdAt)}
        </time>
      </header>
    </main>
  );
};

export default ProjectOverview;
