import React, { useEffect, useState } from "react";
import AspectRatio from "./AspectRatio";
import { createProject, Project } from "../repositories/ProjectRepository";
import Spinner from "./Spinner";
import { useProjects } from "../hooks/ProjectRepositoryHooks";
import "./ProjectList.css";
import { toDateTimeString } from "../helpers/dateHelpers";

const ProjectList: React.FC<{ onOpenProject: (project: Project) => void }> = ({
  onOpenProject,
}) => {
  const [savingNewProject, setSavingNewProject] = useState(false);
  const { projects, loading: loadingProjectList, error } = useProjects();

  useEffect(() => {
    const hash = window.location.hash;
    if (!projects || !hash.startsWith("#project-")) {
      return;
    }
    const projectId = hash.replace("#project-", "");
    const project = projects.find((project) => project.id === projectId);
    if (project) {
      onOpenProject(project);
    }
  }, [projects, onOpenProject]);

  if (error && !loadingProjectList) {
    // Todo: Proper error message styles
    return <p>Uh-oh unable to get Project list {error!.message}</p>;
  }

  const handleCreateProject = async () => {
    try {
      const project = await createProject();
      onOpenProject(project);
    } finally {
      setSavingNewProject(false);
    }
  };
  return (
    <ol className="project-list">
      {savingNewProject ? (
        <AspectRatio as="li" center>
          <Spinner size="xl">Creating new project</Spinner>
        </AspectRatio>
      ) : (
        <AspectRatio as="li">
          <button
            type="button"
            className="project-list__create-project-button xl"
            onClick={handleCreateProject}
          >
            + New Project
          </button>
        </AspectRatio>
      )}

      {loadingProjectList && (
        <AspectRatio as="li" center>
          <Spinner size="xl" fadeIn>
            Loading projects
          </Spinner>
        </AspectRatio>
      )}

      {projects?.map((project) => (
        <AspectRatio as="li" key={project.id}>
          <a
            href={`#project-${project.id}`}
            className="project-link"
            onClick={() => onOpenProject(project)}
          >
            <h3 className="project-link__title xl">{project.name}</h3>
            <time
              className="project-link__footer"
              dateTime={project.createdAt.toISOString()}
            >
              {toDateTimeString(project.createdAt)}
            </time>
          </a>
        </AspectRatio>
      ))}
    </ol>
  );
};

export default ProjectList;
