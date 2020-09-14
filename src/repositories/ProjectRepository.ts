import { DBSchema, openDB } from "idb";
import { v4 as uuidV4 } from "uuid";
import { Cue } from "../types/subtitles";

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  video?: ProjectVideo;
  thumbnail?: string;
};

export type ProjectVideo = {
  duration: number;
  aspectRatio: number;
} & (
  | {
      type: "youtube";
      youtubeId: string;
    }
  | {
      type: "upload";
      fileId: string;
    }
);

export type ProjectCues = {
  id: string;
  name: string;
  projectId: string;
  cues: Cue[];
};

export type ProjectFile = {
  id: string;
  projectId: string;
  file: File;
};

interface ProjectRepository extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: {
      createdAt: Date;
    };
  };
  cues: {
    key: string;
    value: ProjectCues;
    indexes: {
      projectId: string;
    };
  };
  files: {
    key: string;
    value: ProjectFile;
    indexes: {
      projectId: string;
    };
  };
}

const dbPromise = openDB<ProjectRepository>("primary-repository", 1, {
  upgrade(db) {
    const projectStore = db.createObjectStore("projects", { keyPath: "id" });
    const cueStore = db.createObjectStore("cues", { keyPath: "id" });
    const fileStore = db.createObjectStore("files", { keyPath: "id" });

    projectStore.createIndex("createdAt", "createdAt");
    cueStore.createIndex("projectId", "projectId");
    fileStore.createIndex("projectId", "projectId");
  },
});

export const getProjects = async () => {
  const db = await dbPromise;
  return (await db.getAllFromIndex("projects", "createdAt")).reverse();
};

export const getProject = async (projectId: string) => {
  const db = await dbPromise;
  return await db.get("projects", projectId);
};

export type ProjectUpdate = Partial<Project> & Pick<Project, "id">;
export const updateProject = async (projectUpdate: ProjectUpdate) => {
  const db = await dbPromise;
  const oldProject = await getProject(projectUpdate.id);
  if (!oldProject) {
    throw new Error(`No project with ID ${projectUpdate.id} to update`);
  }
  const project = {
    ...oldProject,
    ...projectUpdate,
  };
  await db.put("projects", project);
  return project;
};

export const createProject = async () => {
  const db = await dbPromise;
  const newProject = {
    id: uuidV4(),
    name: "Untitled Project",
    createdAt: new Date(),
  };
  await db.put("projects", newProject);
  return newProject;
};

export const saveFile = async (projectId: string, file: File) => {
  const db = await dbPromise;
  const projectFile = {
    id: uuidV4(),
    projectId,
    file,
  };
  await db.put("files", projectFile);
  return projectFile;
};
