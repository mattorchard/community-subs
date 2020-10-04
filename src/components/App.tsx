import React, { useRef } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import useModifierKeyClasses from "../hooks/useModifierKeyClasses";
import { TranscriptContextProvider } from "../contexts/TranscriptContext";
import NewTranscriptPage from "./NewTranscriptPage";
import Studio from "./Studio";
import LandingPage from "./LandingPage";

const App = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useModifierKeyClasses(wrapperRef);
  return (
    <div ref={wrapperRef}>
      <TranscriptContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route
              path="/transcript/:transcriptId/add-video"
              component={NewTranscriptPage}
            />
            <Route path="/transcript/:transcriptId" component={Studio} />
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </BrowserRouter>
      </TranscriptContextProvider>
    </div>
  );
};

export default App;
