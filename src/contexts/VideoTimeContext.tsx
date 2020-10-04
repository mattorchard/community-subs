import React, { useCallback, useContext, useEffect } from "react";
import useAsRef from "../hooks/useAsRef";
import { Observable } from "../helpers/observableHelpers";

const videoTimeObserver = new Observable<number>();
const VideoTimeContext = React.createContext(videoTimeObserver);

export const usePlayerTimeCallback = (callback: (time: number) => void) => {
  const callbackRef = useAsRef(callback);
  const videoTimeObserver = useContext(VideoTimeContext);
  useEffect(
    () => videoTimeObserver.subscribe((time) => callbackRef.current(time)),
    [videoTimeObserver, callbackRef]
  );
};

export const usePlayerTimePublisher = () => {
  const videoTimeObserver = useContext(VideoTimeContext);
  return useCallback(videoTimeObserver.publish, [videoTimeObserver]);
};
