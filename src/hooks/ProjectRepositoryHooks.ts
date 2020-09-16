import useAsyncValue from "./useAsyncValue";
import {
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
