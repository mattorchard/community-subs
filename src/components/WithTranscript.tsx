import useTranscript from "../hooks/useTranscript";
import Spinner from "./Spinner";
import React from "react";
import { Transcript } from "../types/cue";

const WithTranscript = (
  component: React.FC<{ transcript: Transcript }>
): React.FC => () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const transcript = useTranscript();
  if (!transcript) {
    return <Spinner fadeIn>Loading Transcript</Spinner>;
  }
  const NeedsTranscript = component;
  return <NeedsTranscript transcript={transcript} />;
};

export default WithTranscript;
