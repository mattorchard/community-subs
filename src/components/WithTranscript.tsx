import useTranscript from "../hooks/useTranscript";
import Spinner from "./Spinner";
import React from "react";
import { Transcript } from "../types/cue";

const withTranscript = (
  component: React.FC<{ transcript: Transcript }>
): React.FC =>
  function WithTranscript() {
    const transcript = useTranscript();
    if (!transcript) {
      return <Spinner fadeIn>Loading Transcript</Spinner>;
    }
    const NeedsTranscript = component;
    return <NeedsTranscript transcript={transcript} />;
  };

export default withTranscript;
