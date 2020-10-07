import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { TranscriptContextProvider } from "../contexts/TranscriptContext";
import NewTranscriptPage from "./NewTranscriptPage";
import Studio from "./Studio";
import LandingPage from "./LandingPage";
import { ModifierKeysContextProvider } from "../contexts/ModifierKeysContext";
import ModifierKeysStyler from "./ModifierKeysStyler";

const App = () => {
  return (
    <ModifierKeysContextProvider>
      <ModifierKeysStyler>
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
      </ModifierKeysStyler>
    </ModifierKeysContextProvider>
  );
};

export default App;
