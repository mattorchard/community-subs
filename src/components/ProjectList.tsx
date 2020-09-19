import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AspectRatio from "./AspectRatio";
import { createProject } from "../repositories/ProjectRepository";
import Spinner from "./Spinner";
import { useProjects } from "../hooks/ProjectRepositoryHooks";
import "./ProjectList.css";
import Thumbnail from "./Thumbnail";

const ProjectList: React.FC = () => {
  const history = useHistory();
  const [savingNewProject, setSavingNewProject] = useState(false);
  const { projects, loading: loadingProjectList, error } = useProjects();

  if (error && !loadingProjectList) {
    // Todo: Proper error message styles
    return <p>Uh-oh unable to get Project list {error!.message}</p>;
  }

  const handleCreateProject = async () => {
    try {
      setSavingNewProject(true);
      const project = await createProject();
      history.push(`/project/${project.id}`);
    } catch (error) {
      // Todo: Message
      console.error("Create project failed", error);
      setSavingNewProject(false);
    }
  };
  return (
    <ol className="project-list">
      <AspectRatio as="li" ratio={9 / 16}>
        {savingNewProject ? (
          <Spinner size="xl">Creating new project</Spinner>
        ) : (
          <button
            type="button"
            className="project-list__create-project-button placeholder-button xl"
            onClick={handleCreateProject}
          >
            + New Project
          </button>
        )}
      </AspectRatio>

      {loadingProjectList && (
        <AspectRatio as="li" center ratio={9 / 16}>
          <Spinner size="xl" fadeIn>
            Loading projects
          </Spinner>
        </AspectRatio>
      )}

      {projects?.map((project) => (
        <li key={project.id} className="project-list__item">
          <Link
            to={`/project/${project.id}`}
            className="project-list__item__link"
          >
            <Thumbnail url={project.video?.thumbnailUrl} />
            <h3 className="project-link__title lg">{project.name}</h3>
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default ProjectList;
