import { useTranscriptMatch } from "./RouteHooks";
import { useTranscripts } from "../contexts/TranscriptContext";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Transcript } from "../types/cue";
import { captureException } from "@sentry/react";

const useTranscript = () => {
  const history = useHistory();
  const transcriptId = useTranscriptMatch();
  const transcripts = useTranscripts();
  const [transcript, setTranscript] = useState<Transcript | null>(null);

  useEffect(() => {
    if (!transcripts) {
      return setTranscript(null);
    }
    const transcript = transcripts.find(
      (transcript) => transcript.id === transcriptId
    );
    if (!transcript) {
      const errorMessage = `Error: No transcript with ID ${transcriptId}`;
      toast.error(errorMessage);
      captureException(new Error(errorMessage));
      history.push("/");
      return;
    }
    return setTranscript(transcript);
  }, [transcriptId, transcripts, history]);

  return transcript;
};
export default useTranscript;
