import React from "react";
import VideoPlaybackMock from "./VideoPlaybackMock";
import EditDetailsForm from "./EditDetailsForm";
import Timeline from "./Timeline";
import "./App.css";

const App = () => (
  <div className="app">
    <VideoPlaybackMock />
    <EditDetailsForm />
    <Timeline />
  </div>
);
export default App;
