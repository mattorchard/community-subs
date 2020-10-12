import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import ZoomRange from "./ZoomRange";
import VideoPlayer from "./VideoPlayer";
import "./Studio.css";
import ScriptEditor from "./ScriptEditor";
import { createVttBlob, downloadFile } from "../helpers/fileHelpers";
import { toWebVtt } from "../helpers/exportHelpers";
import Spinner from "./Spinner";
import TopDrawer from "./TopDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getClassName } from "../helpers/domHelpers";
import Timeline from "./Timeline";
import { useOnPlayerTimeChange } from "../contexts/PlayerControlsContext";
import CuePreview from "./CuePreview";
import withStudioContextProviders from "./WithStudioContextProviders";
import SelectionControls from "./SelectionControls";
import MediaControls from "./MediaControls";
import FormatControls from "./FormatControls";
import TimelineControls from "./TimelineControls";
import { useCuesContextUnsafe } from "../contexts/CuesContext";

const Studio = withStudioContextProviders(function Studio({ transcript }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);
  const [isTopDrawerOpen, setIsTopDrawerOpen] = useState(false);
  const { cues } = useCuesContextUnsafe();

  useOnPlayerTimeChange((time: number) =>
    containerRef.current?.style?.setProperty("--player-time", time.toString())
  );

  if (!cues) {
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
          downloadFile(`${transcript.name}.vtt`, createVttBlob(toWebVtt(cues)))
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
      <VideoPlayer video={transcript.video} />
      <CuePreview />
      <ScriptEditor
        duration={transcript.video.duration}
        transcriptId={transcript.id}
      />
      <div className="toolbar">
        <TimelineControls />
        <ZoomRange zoom={scale} onZoomChange={setScale} />
        <MediaControls />
        <SelectionControls />
        <FormatControls />
      </div>
      <Timeline duration={transcript.video.duration} scale={scale} />
    </div>
  );
});

export default Studio;
