import React, { useCallback, useContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Transcript } from "../types/cue";
import useAsRef from "../hooks/useAsRef";
import {
  getTranscripts,
  putTranscript,
} from "../repositories/EntityRepository";

type TranscriptCreate = Omit<Transcript, "id" | "createdAt">;
type TranscriptUpdate = Partial<Transcript> & Pick<Transcript, "id">;
export type TranscriptToSave = TranscriptCreate | TranscriptUpdate;

const TranscriptsContext = React.createContext<Transcript[] | null>(null);
const SaveTranscriptContext = React.createContext<
  (t: TranscriptToSave) => Promise<void>
>(async () => {});

export const TranscriptContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<Transcript[] | null>(null);
  const stateRef = useAsRef(state);

  // Load initial transcripts
  useEffect(() => {
    getTranscripts()
      .then((transcripts) => setState(transcripts))
      .catch((error) => console.error("Failed to load transcripts", error));
  }, []);

  const saveTranscript = useCallback(
    async (partialTranscript: TranscriptToSave) => {
      const oldTranscript =
        "id" in partialTranscript
          ? stateRef.current?.find(
              (existingTranscript) =>
                existingTranscript.id === partialTranscript.id
            )
          : null;

      if (oldTranscript) {
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
      } else {
        const savedTranscript = await putTranscript({
          ...(partialTranscript as TranscriptCreate),
          id: uuidV4(),
          createdAt: new Date(),
        });
        setState((transcripts) =>
          transcripts ? [savedTranscript, ...transcripts] : [savedTranscript]
        );
      }
    },
    [setState, stateRef]
  );

  return (
    <SaveTranscriptContext.Provider value={saveTranscript}>
      <TranscriptsContext.Provider value={state}>
        {children}
      </TranscriptsContext.Provider>
    </SaveTranscriptContext.Provider>
  );
};

export const useTranscripts = () => useContext(TranscriptsContext);

export const useTranscriptActions = () => useContext(SaveTranscriptContext);
