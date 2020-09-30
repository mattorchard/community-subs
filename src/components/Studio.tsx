import React, { useCallback, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import Timeline from "./Timeline";
import ZoomRange from "./ZoomRange";
import useCues from "../hooks/useCues";
import VideoPlayer from "./VideoPlayer";
import "./Studio.css";
import ScriptEditor from "./ScriptEditor";
import Button from "./Button";
import { createVttBlob, downloadFile } from "../helpers/fileHelpers";
import { toWebVtt } from "../helpers/exportHelpers";
import Spinner from "./Spinner";
import { Transcript } from "../types/cue";

const Studio: React.FC<{ transcript: Transcript }> = ({ transcript }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);
  const [selectedCue, setSelectedCue] = useState<string | null>(null);
  const [cueState, setCue] = useCues(transcript.id);
  const [seekTo, setSeekTo] = useState<number | null>(null);

  const onTimeChange = useCallback((time: number) => {
    console.debug("Currently at", time);
    containerRef.current?.style?.setProperty("--player-time", time.toString());
  }, []);

  if (!cueState) {
    return <Spinner fadeIn>Loading transcript</Spinner>;
  }

  if (!transcript.video) {
    return <Redirect to={`/transcript/${transcript.id}/new`} />;
  }

  return (
    <div className="studio" ref={containerRef}>
      <VideoPlayer
        video={transcript.video}
        onTimeChange={onTimeChange}
        seekTo={seekTo}
      />
      <ScriptEditor
        cues={cueState.cues}
        cueIndex={cueState.index}
        setCue={setCue}
        selectedCue={selectedCue}
        onSelectCue={setSelectedCue}
        duration={transcript.video.duration}
      />
      <div className="toolbar">
        <ZoomRange zoom={scale} onZoomChange={setScale} />
        <Button
          onClick={() =>
            containerRef.current?.classList?.toggle("studio--long-script")
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
        duration={transcript.video.duration}
        scale={scale}
        cues={cueState.cues}
        setCue={setCue}
        selectedCue={selectedCue}
        onSelectCue={setSelectedCue}
        onSeek={setSeekTo}
      />
    </div>
  );
};
export default Studio;
