import React, { useCallback, useEffect, useRef } from "react";
import { Observable } from "../helpers/observableHelpers";
import { useLiveCallback } from "../hooks/useLiveCallback";
import { useOnPlayerTimeChange } from "./PlayerControlsContext";
import useContextSafe from "../hooks/useContextSafe";
import { useSelectedCueIndexes } from "./CueSelectionContext";
import useAsRef from "../hooks/useAsRef";

const StudioScrollContext = React.createContext<{
  scrollToIndexObservable: Observable<number>;
  scrollToTimeObservable: Observable<number>;
} | null>(null);
StudioScrollContext.displayName = "StudioScrollContext";

export const StudioScrollContextProvider: React.FC = ({ children }) => {
  const scrollToIndexObservableRef = useRef(new Observable<number>());
  const scrollToTimeObservableRef = useRef(new Observable<number>());
  return (
    <StudioScrollContext.Provider
      value={{
        scrollToIndexObservable: scrollToIndexObservableRef.current,
        scrollToTimeObservable: scrollToTimeObservableRef.current,
      }}
    >
      {children}
    </StudioScrollContext.Provider>
  );
};

export const useOnScrollRequest = (
  onScrollToIndex: (index: number) => void,
  onScrollToTime: (time: number) => void
) => {
  const { scrollToIndexObservable, scrollToTimeObservable } = useContextSafe(
    StudioScrollContext
  );

  const onScrollToIndexLive = useLiveCallback(onScrollToIndex);
  const onScrollToTimeLive = useLiveCallback(onScrollToTime);

  useEffect(() => scrollToIndexObservable.subscribe(onScrollToIndexLive), [
    onScrollToIndexLive,
    scrollToIndexObservable,
  ]);
  useEffect(() => scrollToTimeObservable.subscribe(onScrollToTimeLive), [
    onScrollToTimeLive,
    scrollToTimeObservable,
  ]);
};

export const useScrollToPlayhead = () => {
  const { scrollToTimeObservable } = useContextSafe(StudioScrollContext);
  const playerTimeRef = useRef(0);
  useOnPlayerTimeChange((time) => (playerTimeRef.current = time));
  return useCallback(
    () => scrollToTimeObservable.publish(playerTimeRef.current),
    [scrollToTimeObservable]
  );
};

export const useScrollToSelection = () => {
  const { scrollToIndexObservable } = useContextSafe(StudioScrollContext);
  const selectedCueIndexes = useSelectedCueIndexes();
  const selectedCueIndexesRef = useAsRef(selectedCueIndexes);
  return useCallback(() => {
    if (selectedCueIndexesRef.current.length > 0) {
      scrollToIndexObservable.publish(
        Math.min(...selectedCueIndexesRef.current)
      );
    }
  }, [scrollToIndexObservable, selectedCueIndexesRef]);
};
