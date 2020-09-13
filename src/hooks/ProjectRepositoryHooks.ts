import useAsyncValue from "./useAsyncValue";
import { getProjects, Project } from "../repositories/ProjectRepository";

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
