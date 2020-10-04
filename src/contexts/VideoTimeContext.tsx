import React, { useCallback, useContext, useEffect, useRef } from "react";
import useAsRef from "../hooks/useAsRef";
import { Observable } from "../helpers/observableHelpers";

const VideoTimeContext = React.createContext<Observable<number> | null>(null);

export const VideoTimeContextProvider: React.FC = ({ children }) => {
  const videoTimeObserver = useRef(new Observable<number>());
  return (
    <VideoTimeContext.Provider value={videoTimeObserver.current}>
      {children}
    </VideoTimeContext.Provider>
  );
};

export const usePlayerTimeCallback = (callback: (time: number) => void) => {
  const videoTimeObserver = useContext(VideoTimeContext);
  if (!videoTimeObserver) {
    throw new Error(
      "usePlayerTimeCallback cannot be used outside of VideoTimeContextProvider"
    );
  }
  const callbackRef = useAsRef(callback);
  useEffect(
    () => videoTimeObserver.subscribe((time) => callbackRef.current(time)),
    [videoTimeObserver, callbackRef]
  );
};

export const usePlayerTimePublisher = () => {
  const videoTimeObserver = useContext(VideoTimeContext);
  if (!videoTimeObserver) {
    throw new Error(
      "usePlayerTimeCallback cannot be used outside of VideoTimeContextProvider"
    );
  }
  return useCallback(videoTimeObserver.publish, [videoTimeObserver]);
};
