import { DBSchema, openDB } from "idb";
import { Cue, Transcript } from "../types/cue";
import { v4 as uuidV4 } from "uuid";

type FileExtended = {
  id: string;
  createdAt: Date;
  file: File;
}

interface EntityRepository extends DBSchema {
  transcripts: {
    key: string;
    value: Transcript;
    indexes: {
      accessedAt: "accessedAt"
      "videoId": ["video", "id"]
    }
  },
  cues: {
    key: string;
    value: Cue
    indexes: {
      transcriptId: "transcriptId"
    }
  },
  files: {
    key: string;
    value: FileExtended;
    indexes: {
      createdAt: "createdAt"
    }
  },
}

const dbPromise = openDB<EntityRepository>("entity-repository", 1, {
  upgrade(db) {
    const idForKey = { keyPath: "id" };
    const transcriptStore = db.createObjectStore("transcripts", idForKey);
    const cueStore = db.createObjectStore("cues", idForKey);
    const fileStore = db.createObjectStore("files", idForKey);

    transcriptStore.createIndex("accessedAt", "accessedAt")
    transcriptStore.createIndex("videoId", ["video", "id"])

    cueStore.createIndex("transcriptId", "transcriptId")

    fileStore.createIndex("createdAt", "createdAt")
  }
});

export const getTranscripts = async () => {
  const db = await dbPromise;
  const transcripts = await db.getAllFromIndex("transcripts", "accessedAt");
  return transcripts.reverse()
}

export const putTranscript = async(transcript: Transcript) => {
  const db = await dbPromise;
  await db.put("transcripts", transcript);
  return transcript;
}

export const createFile = async (file: File) => {
  const db = await dbPromise;
  const completeFile = {
    id: uuidV4(),
    createdAt: new Date(),
    file
  };
  await db.put("files", completeFile);
  return completeFile;
}

export const getFile = async (fileId: string) => {
  const db = await dbPromise;
  const file = await db.get("files", fileId);
  if (!file) {
    throw new Error(`No file with ID ${fileId}`);
  }
  return file;
}