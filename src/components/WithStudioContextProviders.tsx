import React, { useRef } from "react";
import { VideoTimeContextProvider } from "../contexts/VideoTimeContext";
import { Observable } from "../helpers/observableHelpers";

const withStudioContextProviders = (component: React.FC): React.FC =>
  function WithStudioContextProviders() {
    const videoTimeObserver = useRef(new Observable<number>());
    const NeedsProviders = component;
    return (
      <VideoTimeContextProvider value={videoTimeObserver.current}>
        <NeedsProviders />
      </VideoTimeContextProvider>
    );
  };

export default withStudioContextProviders;
