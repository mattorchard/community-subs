import React from "react";
import VideoPlaybackMock from "./VideoPlaybackMock";
import EditDetailsForm from "./EditDetailsForm";
import Timeline from "./Timeline";
import ZoomRange from "./ZoomRange";
import useCues from "../hooks/useCues";
import Button from "./Button";
import "./App.css";

const App = () => {
  const [selectedCue, setSelectedCue] = React.useState<string | null>(null);
  const [scale, setScale] = React.useState(0.1);
  const [cues, saveCue] = useCues();
  return (
    <div className="app">
      <VideoPlaybackMock />
      <EditDetailsForm
        selectedCue={selectedCue ? cues[selectedCue] : null}
        saveCue={saveCue}
      />
      <div className="toolbar">
        <ZoomRange zoom={scale} onZoomChange={setScale} />
        <Button>Add Caption</Button>
      </div>
      <Timeline
        duration={60 * 1000}
        scale={scale}
        cues={cues}
        saveCue={saveCue}
        onSelectCue={setSelectedCue}
      />
    </div>
  );
};
export default App;
