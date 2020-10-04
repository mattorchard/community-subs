import React from "react";
import TranscriptList from "./TranscriptList";
import "./LandingPage.css";
import { Alert } from "./Alert";

const LandingPage = () => (
  <div className="landing-page" id="welcome">
    <section className="landing-page__welcome-section">
      <h1 className="landing-page__welcome-section__title">Community Subs</h1>
      <Alert
        type="warning"
        heading={<h2>Warning Pre-Release</h2>}
        description={
          <p>
            This is a pre-release version of <strong>Community Subs</strong>. As
            such, transcripts may be deleted during updates without warning.
            Please regularly export any work you want to keep.
          </p>
        }
      />

      {/*Todo: Warning to Safari users about storage issue */}
    </section>
    <section className="landing-page__transcript-section">
      <TranscriptList />
    </section>
  </div>
);
export default LandingPage;
