import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import ZoomRange from "./ZoomRange";
import useCues from "../hooks/useCues";
import VideoPlayer from "./VideoPlayer";
import "./Studio.css";
import ScriptEditor from "./ScriptEditor";
import { createVttBlob, downloadFile } from "../helpers/fileHelpers";
import { toWebVtt } from "../helpers/exportHelpers";
import Spinner from "./Spinner";
import WithTranscript from "./WithTranscript";
import TopDrawer from "./TopDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getClassName } from "../helpers/domHelpers";
import Timeline from "./Timeline";
import { usePlayerTimeCallback } from "../contexts/VideoTimeContext";
import CuePreview from "./CuePreview";

const Studio = WithTranscript(({ transcript }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);
  const [selectedCue, setSelectedCue] = useState<string | null>(null);
  const [cueState, setCue] = useCues(transcript.id);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [isTopDrawerOpen, setIsTopDrawerOpen] = useState(false);

  usePlayerTimeCallback((time: number) =>
    containerRef.current?.style?.setProperty("--player-time", time.toString())
  );

  if (!cueState) {
    return <Spinner fadeIn>Loading transcript</Spinner>;
  }

  if (!transcript.video) {
    return <Redirect to={`/transcript/${transcript.id}/add-video`} />;
  }

  return (
    <div className="studio" ref={containerRef}>
      <TopDrawer
        isOpen={isTopDrawerOpen}
        onRequestClose={() => setIsTopDrawerOpen(false)}
        onRequestExport={() =>
          downloadFile(
            `${transcript.name}.vtt`,
            createVttBlob(toWebVtt(cueState))
          )
        }
        transcript={transcript}
      />
      <button
        className={getClassName(
          "studio__open-drawer-button",
          {
            open: isTopDrawerOpen,
          },
          "lg"
        )}
        onClick={() => setIsTopDrawerOpen(true)}
        title="Open drawer"
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      <VideoPlayer video={transcript.video} seekTo={seekTo} />
      <CuePreview cues={cueState.cues} cueIndex={cueState.index} />
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
});

export default Studio;
