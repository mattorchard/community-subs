import React from "react";
import { PlayerControlsContextProvider } from "../contexts/PlayerControlsContext";
import { CueSelectionProvider } from "../contexts/CueSelectionContext";

const withStudioContextProviders = (component: React.FC): React.FC =>
  function WithStudioContextProviders() {
    const NeedsProviders = component;
    return (
      <PlayerControlsContextProvider>
        <CueSelectionProvider>
          <NeedsProviders />
        </CueSelectionProvider>
      </PlayerControlsContextProvider>
    );
  };

export default withStudioContextProviders;
