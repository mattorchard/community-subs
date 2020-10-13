import React from "react";
import * as Sentry from "@sentry/react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { TranscriptContextProvider } from "../contexts/TranscriptContext";
import NewTranscriptPage from "./NewTranscriptPage";
import Studio from "./Studio";
import LandingPage from "./LandingPage";
import { ModifierKeysContextProvider } from "../contexts/ModifierKeysContext";
import ModifierKeysStyler from "./ModifierKeysStyler";
import FallbackPage from "./FallbackPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Sentry.ErrorBoundary fallback={FallbackPage}>
      <ToastContainer />
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
    </Sentry.ErrorBoundary>
  );
};

export default App;
