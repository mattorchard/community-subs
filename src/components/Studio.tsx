import React from "react";
import Timeline from "./Timeline";
import ZoomRange from "./ZoomRange";
import useCues from "../hooks/useCues";
import VideoPlayer from "./VideoPlayer";
import "./Studio.css";
import ScriptEditor from "./ScriptEditor";
import Button from "./Button";
import { createVttBlob, downloadFile } from "../helpers/fileHelpers";
import { toWebVtt } from "../helpers/webVttHelpers";
import Spinner from "./Spinner";

const Studio: React.FC<{ transcriptId: string }> = ({ transcriptId }) => {
  const appRef = React.useRef<HTMLDivElement>(null);
  const [duration, setDuration] = React.useState(60 * 1000);
  const [scale, setScale] = React.useState(0.1);

  const [cueState, setCue] = useCues(transcriptId);
  const onTimeChange = React.useCallback((time: number) => {
    console.debug("Currently at", time);
    appRef.current?.style?.setProperty("--player-time", time.toString());
  }, []);

  if (!cueState) {
    return <Spinner>Loading transcript...</Spinner>;
  }

  return (
    <div className="studio" ref={appRef}>
      <VideoPlayer
        onTimeChange={onTimeChange}
        onInit={({ duration }) => setDuration(duration)}
      />
      <ScriptEditor cues={cueState.cues} setCue={setCue} duration={duration} />
      <div className="toolbar">
        <ZoomRange zoom={scale} onZoomChange={setScale} />
        <Button
          onClick={() =>
            appRef.current?.classList?.toggle("studio--long-script")
          }
        >
          Toggle View
        </Button>
        <Button
          onClick={() => {
            downloadFile(
              "CommunitySubs.vtt",
              createVttBlob(toWebVtt(cueState))
            );
          }}
        >
          Export
        </Button>
      </div>
      <Timeline
        duration={duration}
        scale={scale}
        cues={cueState.cues}
        setCue={setCue}
      />
    </div>
  );
};
export default Studio;
