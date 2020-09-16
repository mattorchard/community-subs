import useAsyncValue from "./useAsyncValue";
import {
  getFile,
  getProject,
  getProjects,
  getTranscripts,
  Project,
} from "../repositories/ProjectRepository";

export const useProjects = () => {
  const { result: projects, error, loading } = useAsyncValue<Project[]>(
    getProjects,
    []
  );
  return {
    projects,
    error,
    loading,
  };
};

export const useProject = (projectId: string) => {
  const { result: project, error, loading } = useAsyncValue(
    () => getProject(projectId),
    [projectId]
  );
  return {
    project,
    error,
    loading,
  };
};

export const useTranscripts = (projectId: string) => {
  const { result: transcripts, error, loading } = useAsyncValue(
    () => getTranscripts(projectId),
    [projectId]
  );
  return {
    transcripts,
    error,
    loading,
  };
};

export const useFile = (fileId: string) => {
  const { result: file, error, loading } = useAsyncValue(
    () => getFile(fileId),
    [fileId]
  );
  return {
    file,
    error,
    loading,
  };
};
