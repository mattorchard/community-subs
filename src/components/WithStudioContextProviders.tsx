import React from "react";
import { PlayerControlsContextProvider } from "../contexts/PlayerControlsContext";
import { CueSelectionProvider } from "../contexts/CueSelectionContext";
import { ToolsContextProvider } from "../contexts/ToolsContext";
import { CuesContextProvider } from "../contexts/CuesContext";
import useTranscript from "../hooks/useTranscript";
import Spinner from "./Spinner";
import { Transcript } from "../types/cue";
import { StudioScrollContextProvider } from "../contexts/StudioScrollContext";

const withStudioContextProviders = (
  component: React.FC<{ transcript: Transcript }>
): React.FC =>
  function WithStudioContextProviders() {
    const transcript = useTranscript();
    if (!transcript) {
      return <Spinner fadeIn>Loading Transcript</Spinner>;
    }
    const NeedsProviders = component;
    return (
      <PlayerControlsContextProvider>
        <ToolsContextProvider>
          <StudioScrollContextProvider>
            <CueSelectionProvider>
              <CuesContextProvider transcriptId={transcript.id}>
                <NeedsProviders transcript={transcript} />
              </CuesContextProvider>
            </CueSelectionProvider>
          </StudioScrollContextProvider>
        </ToolsContextProvider>
      </PlayerControlsContextProvider>
    );
  };

export default withStudioContextProviders;
