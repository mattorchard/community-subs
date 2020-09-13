import React from "react";
import AspectRatio from "./AspectRatio";
import { createProject } from "../repositories/ProjectRepository";
import Spinner from "./Spinner";
import { useProjects } from "../hooks/ProjectRepositoryHooks";
import "./ProjectList.css";

const ProjectList = () => {
  const { projects, loading, error } = useProjects();
  if (error && !loading) {
    // Todo: Proper error message styles
    return <p>Uh-oh unable to get Project list {error!.message}</p>;
  }
  return (
    <ol className="project-list">
      <AspectRatio as="li">
        <button
          type="button"
          className="project-list__create-project-button xl"
          onClick={createProject}
        >
          + New Project
        </button>
      </AspectRatio>

      {loading && (
        <AspectRatio as="li" center>
          <Spinner size="xl" fadeIn>
            Loading projects
          </Spinner>
        </AspectRatio>
      )}

      {projects?.map((project) => (
        <AspectRatio as="li" key={project.id}>
          <a href={`#project-${project.id}`} className="project-link">
            <h3 className="project-link__title xl">{project.name}</h3>
            <small className="project-link__footer">
              {project.createdAt.toLocaleString()}
            </small>
          </a>
        </AspectRatio>
      ))}
    </ol>
  );
};

export default ProjectList;
