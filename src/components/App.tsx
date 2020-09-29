import React, { useRef } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import TranscriptList from "./TranscriptList";
import "./App.css";
import useModifierKeyClasses from "../hooks/useModifierKeyClasses";
import { TranscriptContextProvider } from "../contexts/TranscriptContext";
import NewTranscriptPage from "./NewTranscriptPage";

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
              path="/transcript/:transcriptId/new"
              component={NewTranscriptPage}
            />
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </BrowserRouter>
      </TranscriptContextProvider>
    </div>
  );
};

const LandingPage = () => (
  <div className="landing-page" id="welcome">
    <section className="landing-page__welcome-section">
      <h1 className="landing-page__welcome-section__title">Community Subs</h1>
      <p className="landing-page__welcome-section__explainer">
        Welcome to <strong>Community Subs</strong>! Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Nullam sed venenatis dui. Sed interdum
        ullamcorper leo at volutpat. Morbi non ipsum dolor. Maecenas nisi diam,
        blandit at tincidunt non, porttitor in nisi. Sed eu vehicula magna.
        Mauris sagittis urna vel nulla aliquet posuere. Nullam tellus erat,
        rutrum nec orci at, convallis varius dui. Aliquam libero turpis,
        fringilla accumsan mauris et, auctor feugiat eros. Nunc odio erat,
        pellentesque in fermentum et, ullamcorper nec nisi. Mauris non pretium
        eros. Maecenas diam elit, scelerisque sed elit vitae, sodales mollis
        enim. Morbi eget odio congue, auctor tellus eget, mollis nulla. Etiam
        sagittis accumsan augue, egestas sagittis eros dictum sed. Pellentesque
        finibus finibus lacus, quis volutpat nulla feugiat id.
      </p>
      {/*Todo: Warning to Safari users about storage issue */}
    </section>
    <section className="landing-page__transcript-section">
      <TranscriptList />
    </section>
  </div>
);

export default App;
