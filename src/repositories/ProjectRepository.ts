import { DBSchema, openDB } from "idb";
import { v4 as uuidV4 } from "uuid";
import { Cue } from "../types/subtitles";

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  video?: ProjectVideo;
};

export type ProjectVideo = {
  duration: number;
  aspectRatio: number;
  thumbnailUrl?: string;
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

export type ProjectTranscript = {
  id: string;
  projectId: string;
  name: string;
  language: string;
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
  transcripts: {
    key: string;
    value: ProjectTranscript;
    indexes: {
      projectId: string;
    };
  };
  cues: {
    key: string;
    value: Cue;
    indexes: {
      transcriptId: string;
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
    const idForKey = { keyPath: "id" };
    const projectStore = db.createObjectStore("projects", idForKey);
    const transcriptStore = db.createObjectStore("transcripts", idForKey);
    const cueStore = db.createObjectStore("cues", idForKey);
    const fileStore = db.createObjectStore("files", idForKey);

    projectStore.createIndex("createdAt", "createdAt");
    transcriptStore.createIndex("projectId", "projectId");
    cueStore.createIndex("transcriptId", "transcriptId");
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

export const getCues = async (transcriptId: string) => {
  const db = await dbPromise;
  return await db.getAllFromIndex(
    "cues",
    "transcriptId",
    IDBKeyRange.only(transcriptId)
  );
};

export const saveCue = async (cue: Cue) => {
  const db = await dbPromise;
  await db.put("cues", cue);
  return cue;
};

export const getTranscripts = async (projectId: string) => {
  const db = await dbPromise;
  return await db.getAllFromIndex(
    "transcripts",
    "projectId",
    IDBKeyRange.only(projectId)
  );
};

export const createTranscript = async (projectId: string) => {
  const db = await dbPromise;
  const transcript: ProjectTranscript = {
    projectId,
    id: uuidV4(),
    name: "Untitled Transcript",
    language: "English",
  };
  await db.put("transcripts", transcript);
  return transcript;
};
