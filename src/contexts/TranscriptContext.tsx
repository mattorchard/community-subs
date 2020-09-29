import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Transcript } from "../types/cue";
import useAsRef from "../hooks/useAsRef";
import {
  getTranscripts,
  putTranscript,
} from "../repositories/EntityRepository";

type TranscriptUpdate = Partial<Transcript> & Pick<Transcript, "id">;

const TranscriptsContext = React.createContext<Transcript[] | null>(null);
const TranscriptActionsContext = React.createContext<{
  createTranscript: () => Promise<Transcript>;
  updateTranscript: (t: TranscriptUpdate) => Promise<Transcript>;
}>({
  createTranscript: async () => {
    throw new Error(`Accessing actions outside context root`);
  },
  updateTranscript: async () => {
    throw new Error(`Accessing actions outside context root`);
  },
});

export const TranscriptContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<Transcript[] | null>(null);
  const stateRef = useAsRef(state);

  // Load initial transcripts
  useEffect(() => {
    getTranscripts()
      .then((transcripts) => setState(transcripts))
      .catch((error) => console.error("Failed to load transcripts", error));
  }, []);

  const actions = useMemo(
    () => ({
      updateTranscript: async (partialTranscript: TranscriptUpdate) => {
        const oldTranscript = stateRef.current?.find(
          (existingTranscript) => existingTranscript.id === partialTranscript.id
        );

        if (!oldTranscript) {
          throw new Error(
            `No transcript with ID ${partialTranscript.id} to update`
          );
        }
        const savedTranscript = await putTranscript({
          ...oldTranscript,
          ...partialTranscript,
        });

        setState((state) =>
          state
            ? state.map((otherTranscript) =>
                otherTranscript.id === savedTranscript.id
                  ? savedTranscript
                  : otherTranscript
              )
            : [savedTranscript]
        );
        return savedTranscript;
      },
      createTranscript: async () => {
        const savedTranscript = await putTranscript({
          id: uuidV4(),
          name: "New Transcript",
          createdAt: new Date(),
          accessedAt: new Date(),
        });
        setState((transcripts) =>
          transcripts ? [savedTranscript, ...transcripts] : [savedTranscript]
        );
        return savedTranscript;
      },
    }),
    [setState, stateRef]
  );

  return (
    <TranscriptActionsContext.Provider value={actions}>
      <TranscriptsContext.Provider value={state}>
        {children}
      </TranscriptsContext.Provider>
    </TranscriptActionsContext.Provider>
  );
};

export const useTranscripts = () => useContext(TranscriptsContext);

export const useTranscriptActions = () => useContext(TranscriptActionsContext);
