import { useTranscriptMatch } from "./RouteHooks";
import { useTranscripts } from "../contexts/TranscriptContext";
import { useMemo } from "react";

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
export default useTranscript;
