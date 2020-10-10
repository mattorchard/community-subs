import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Transcript } from "../types/cue";
import {
  getTranscripts,
  patchTranscript,
  putTranscript,
  TranscriptPatch,
} from "../repositories/EntityRepository";

const TranscriptsContext = React.createContext<Transcript[] | null>(null);
const TranscriptActionsContext = React.createContext<{
  createTranscript: () => Promise<Transcript>;
  updateTranscript: (transcriptPatch: TranscriptPatch) => Promise<Transcript>;
}>({
  createTranscript: async () => {
    throw new Error(`Accessing actions outside context root`);
  },
  updateTranscript: async () => {
    throw new Error(`Accessing actions outside context root`);
  },
});

export const TranscriptContextProvider: React.FC = ({ children }) => {
  const [transcripts, setTranscripts] = useState<Transcript[] | null>(null);

  // Load initial transcripts
  useEffect(() => {
    getTranscripts()
      .then((transcripts) => setTranscripts(transcripts))
      .catch((error) => console.error("Failed to load transcripts", error));
  }, []);

  const actions = useMemo(
    () => ({
      updateTranscript: async (transcriptPatch: TranscriptPatch) => {
        const savedTranscript = await patchTranscript(transcriptPatch);
        setTranscripts((state) =>
          state
            ? state.map((otherTranscript) =>
                otherTranscript.id === savedTranscript.id
                  ? savedTranscript
                  : otherTranscript
              )
            : null
        );
        return savedTranscript;
      },
      createTranscript: async () => {
        const savedTranscript = await putTranscript({
          id: uuidV4(),
          name: "Untitled Transcript",
          createdAt: new Date(),
          accessedAt: new Date(),
        });
        setTranscripts((transcripts) =>
          transcripts ? [savedTranscript, ...transcripts] : [savedTranscript]
        );
        return savedTranscript;
      },
    }),
    [setTranscripts]
  );

  return (
    <TranscriptActionsContext.Provider value={actions}>
      <TranscriptsContext.Provider value={transcripts}>
        {children}
      </TranscriptsContext.Provider>
    </TranscriptActionsContext.Provider>
  );
};

export const useTranscripts = () => useContext(TranscriptsContext);

export const useTranscriptActions = () => useContext(TranscriptActionsContext);
