import React, { useMemo } from "react";
import { useTranscriptMatch } from "../hooks/RouteHooks";
import { useTranscripts } from "../contexts/TranscriptContext";
import Spinner from "./Spinner";

const useTranscript = () => {
  const transcriptId = useTranscriptMatch();
  const transcripts = useTranscripts();

  return useMemo(() => {
    if (!transcripts) {
      return null;
    }
    const transcript = transcripts.find(
      (transcript) => transcript.id === transcriptId
    );
    if (!transcript) {
      throw new Error(`No transcript with ID ${transcriptId}`);
    }
    return transcript;
  }, [transcriptId, transcripts]);
};

const NewTranscriptPage = () => {
  const transcript = useTranscript();
  if (!transcript) {
    return <Spinner fadeIn>Loading Transcript</Spinner>;
  }
  return <h1>Okay</h1>;
};

export default NewTranscriptPage;
