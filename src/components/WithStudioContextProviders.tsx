import React from "react";
import { VideoTimeContextProvider } from "../contexts/VideoTimeContext";
import { CueSelectionProvider } from "../contexts/CueSelectionContext";

const withStudioContextProviders = (component: React.FC): React.FC =>
  function WithStudioContextProviders() {
    const NeedsProviders = component;
    return (
      <VideoTimeContextProvider>
        <CueSelectionProvider>
          <NeedsProviders />
        </CueSelectionProvider>
      </VideoTimeContextProvider>
    );
  };

export default withStudioContextProviders;
