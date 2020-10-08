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

const STEP_AMOUNT = 2500;

const MediaControls = () => {
  const [isPlaying, setIsPlaying] = useIsPlayingState();
  const seekStep = useSeekStep();

  return (
    <div role="group" className="media-controls">
      <button
        className="media-controls__step xxl"
        title="Step Backward (J)"
        onClick={() => seekStep(-STEP_AMOUNT)}
      >
        <FontAwesomeIcon icon={faStepBackward} />
      </button>
      <button
        className="media-controls__play-pause xl"
        onClick={() => setIsPlaying(!isPlaying)}
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
        onClick={() => seekStep(STEP_AMOUNT)}
      >
        <FontAwesomeIcon icon={faStepForward} />
      </button>
    </div>
  );
};

export default MediaControls;
