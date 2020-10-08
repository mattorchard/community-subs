import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import "./MediaControls.css";

const MediaControls = () => {
  const [playing, setPlaying] = useState(false);
  return (
    <div role="group" className="media-controls">
      <button className="media-controls__step xxl" title="Step Backward (J)">
        <FontAwesomeIcon icon={faStepBackward} />
      </button>
      <button
        className="media-controls__play-pause xl"
        onClick={() => setPlaying(!playing)}
        title={playing ? "Pause (K)" : "Play (K)"}
      >
        {playing ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button className="media-controls__step xxl" title="Step Forward (L)">
        <FontAwesomeIcon icon={faStepForward} />
      </button>
    </div>
  );
};

export default MediaControls;
