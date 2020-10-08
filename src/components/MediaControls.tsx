import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import "./MediaControls.css";
import {
  useIsPlayingState,
  useSeekStep,
} from "../contexts/PlayerControlsContext";
import useShortcut from "../hooks/useShortcut";

const STEP_AMOUNT = 2500;

const MediaControls = () => {
  const [isPlaying, setIsPlaying] = useIsPlayingState();
  const seekStep = useSeekStep();

  const toggleIsPlaying = () => setIsPlaying(!isPlaying);
  const stepBack = () => seekStep(-STEP_AMOUNT);
  const stepForward = () => seekStep(STEP_AMOUNT);

  useShortcut("j", stepBack);
  useShortcut("k", toggleIsPlaying);
  useShortcut("l", stepForward);

  return (
    <div role="group" className="media-controls">
      <button
        className="media-controls__step xxl"
        title="Step Backward (J)"
        onClick={stepBack}
      >
        <FontAwesomeIcon icon={faStepBackward} />
      </button>
      <button
        className="media-controls__play-pause xl"
        onClick={toggleIsPlaying}
        title={isPlaying ? "Pause (K)" : "Play (K)"}
      >
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button
        className="media-controls__step xxl"
        title="Step Forward (L)"
        onClick={stepForward}
      >
        <FontAwesomeIcon icon={faStepForward} />
      </button>
    </div>
  );
};

export default MediaControls;
