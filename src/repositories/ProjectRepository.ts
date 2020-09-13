import { DBSchema, openDB } from "idb";
import { v4 as uuidV4 } from "uuid";
import { Cue } from "../types/subtitles";

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  thumbnail?: string;
};

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
  return await db.getAll("projects");
};

export const createProject = async () => {
  const db = await dbPromise;
  const newProject: Project = {
    id: uuidV4(),
    name: "New Project",
    createdAt: new Date(),
  };
  await db.put("projects", newProject);
  return newProject;
};
