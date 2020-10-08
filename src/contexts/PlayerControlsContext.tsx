import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useAsRef from "../hooks/useAsRef";
import { Observable } from "../helpers/observableHelpers";

type PlayerControlsContextValue = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTimeObserver: Observable<number>;
  seekObserver: Observable<number>;
  seekStep: (stepSize: number) => void;
};

const PlayerControlsContext = React.createContext<PlayerControlsContextValue | null>(
  null
);

export const PlayerControlsContextProvider: React.FC = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTimeObserver = useRef(new Observable<number>());
  const seekObserver = useRef(new Observable<number>());

  const currentTimeRef = useRef(0);
  useEffect(
    () =>
      currentTimeObserver.current.subscribe(
        (time) => (currentTimeRef.current = time)
      ),
    [currentTimeObserver]
  );
  const seekObserverValue = seekObserver.current;
  const seekStep = useCallback(
    (stepSize) => {
      seekObserverValue.publish(currentTimeRef.current + stepSize);
    },
    [seekObserverValue]
  );

  return (
    <PlayerControlsContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        currentTimeObserver: currentTimeObserver.current,
        seekObserver: seekObserver.current,
        seekStep,
      }}
    >
      {children}
    </PlayerControlsContext.Provider>
  );
};

const NO_PROVIDER_ERROR = "Cannot use VideoTimeContext outside of provider";

export const useOnPlayerTimeChange = (onChange: (time: number) => void) => {
  const context = useContext(PlayerControlsContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  const currentTimeObserver = context.currentTimeObserver;
  const onChangeRef = useAsRef(onChange);
  useEffect(
    () => currentTimeObserver.subscribe((time) => onChangeRef.current(time)),
    [currentTimeObserver, onChangeRef]
  );
};

export const usePlayerTimePublisher = () => {
  const context = useContext(PlayerControlsContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  const currentTimeObserver = context.currentTimeObserver;
  return useCallback(currentTimeObserver.publish, [currentTimeObserver]);
};

export const useSeekTo = () => {
  const context = useContext(PlayerControlsContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  return context.seekObserver.publish;
};

export const useOnSeekTo = (onSeekTo: (time: number) => void) => {
  const context = useContext(PlayerControlsContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  const seekObserver = context.seekObserver;
  const onSeekToRef = useAsRef(onSeekTo);
  useEffect(() => seekObserver.subscribe((time) => onSeekToRef.current(time)), [
    seekObserver,
    onSeekToRef,
  ]);
};

export const useIsPlayingState = (): [
  boolean,
  (isPlaying: boolean) => void
] => {
  const context = useContext(PlayerControlsContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);

  const { isPlaying, setIsPlaying } = context;
  return [isPlaying, setIsPlaying];
};

export const useSeekStep = () => {
  const context = useContext(PlayerControlsContext);
  if (!context) throw new Error(NO_PROVIDER_ERROR);
  return context.seekStep;
};
