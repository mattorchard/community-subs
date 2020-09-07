import React from "react";
import VideoPlaybackMock from "./VideoPlaybackMock";
import EditDetailsForm from "./EditDetailsForm";
import Timeline from "./Timeline";
import "./App.css";
import ZoomRange from "./ZoomRange";

const App = () => {
  const [scale, setScale] = React.useState(0.1);
  return (
    <div className="app">
      <VideoPlaybackMock />
      <EditDetailsForm />
      <div className="toolbar">
        <ZoomRange zoom={scale} onZoomChange={setScale} />
      </div>
      <Timeline duration={60 * 1000} scale={scale} />
    </div>
  );
};
export default App;
