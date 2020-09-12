import React from "react";
import Timeline from "./Timeline";
import ZoomRange from "./ZoomRange";
import useCues from "../hooks/useCues";
import VideoPlayer from "./VideoPlayer";
import "./App.css";
import ScriptEditor from "./ScriptEditor";
import Button from "./Button";

const App = () => {
  const appRef = React.useRef<HTMLDivElement>(null);
  const [duration, setDuration] = React.useState(60 * 1000);
  const [scale, setScale] = React.useState(0.1);

  const [cueState, saveCue] = useCues();
  const onTimeChange = React.useCallback((time: number) => {
    console.debug("Currently at", time);
    appRef.current?.style?.setProperty("--player-time", time.toString());
  }, []);

  return (
    <div className="app" ref={appRef}>
      <VideoPlayer
        onTimeChange={onTimeChange}
        onInit={({ duration }) => setDuration(duration)}
      />
      <ScriptEditor cues={cueState.cues} saveCue={saveCue} />
      <div className="toolbar">
        <ZoomRange zoom={scale} onZoomChange={setScale} />
        <Button
          onClick={() => appRef.current?.classList?.toggle("app--long-script")}
        >
          Toggle View
        </Button>
      </div>
      <Timeline
        duration={duration}
        scale={scale}
        cues={cueState.cues}
        saveCue={saveCue}
      />
    </div>
  );
};
export default App;
