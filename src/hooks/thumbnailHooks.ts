import { Project } from "../repositories/ProjectRepository";
import { useMemo } from "react";
import useObjectUrls from "./useObjectUrls";

export const useProjectThumbnails = (projects: Project[]) => {
  const thumbnailBlobs = useMemo(
    () => projects.map((project) => project.video?.thumbnail),
    [projects]
  );
  return useObjectUrls(thumbnailBlobs);
};

export const useProjectThumbnail = (project: Project) => {
  const thumbnailBlobs = useMemo(() => [project.video?.thumbnail], [project]);
  return useObjectUrls(thumbnailBlobs)[0];
};
