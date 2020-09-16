import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AspectRatio from "./AspectRatio";
import { createProject } from "../repositories/ProjectRepository";
import Spinner from "./Spinner";
import { useProjects } from "../hooks/ProjectRepositoryHooks";
import "./ProjectList.css";

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
          <Link
            to={`/project/${project.id}`}
            className="project-link thumbnail-background"
            style={{ backgroundImage: `url(${project.video?.thumbnailUrl})` }}
          >
            <h3 className="project-link__title xl">{project.name}</h3>
          </Link>
        </AspectRatio>
      ))}
    </ol>
  );
};

export default ProjectList;
