import React from "react";
import VideoPlaybackMock from "./VideoPlaybackMock";
import EditDetailsForm from "./EditDetailsForm";
import Timeline from "./Timeline";
import "./App.css";

const App = () => (
  <div className="app">
    <VideoPlaybackMock />
    <EditDetailsForm />
    <Timeline duration={60 * 1000} />
  </div>
);
export default App;
