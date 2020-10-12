import React from "react";
import TranscriptList from "./TranscriptList";
import "./LandingPage.css";
import { Alert } from "./Alert";
import { getIsStorageVolatile } from "../helpers/storageHelpers";
import ExternalLink from "./ExternalLink";

const LandingPage = () => {
  const isBrowserSupported = !getIsStorageVolatile();
  return (
    <div className="landing-page" id="welcome">
      <section className="landing-page__welcome-section">
        <h1 className="landing-page__welcome-section__title">Community Subs</h1>
        <Alert
          type="warning"
          heading={<h2>Warning Pre-Release</h2>}
          description={
            <>
              This is a pre-release version of <strong>Community Subs</strong>.
              As such, transcripts may be deleted during updates without
              warning. Please regularly export any work you want to keep.
            </>
          }
          passive
        />
        {isBrowserSupported || (
          <Alert
            type="error"
            heading={<h2>Unsupported Browser</h2>}
            className="unsupported-browser-alert"
            description={
              <>
                It looks like you are using an unsupported browser.
                <strong>Community Subs</strong> supports:{" "}
                <ExternalLink to="https://www.google.com/chrome/">
                  Chrome
                </ExternalLink>
                ,{" "}
                <ExternalLink to="https://www.mozilla.org/firefox">
                  FireFox
                </ExternalLink>
                ,{" "}
                <ExternalLink to="https://brave.com/download/">
                  Brave
                </ExternalLink>
                , and{" "}
                <ExternalLink to="https://www.microsoft.com/edge">
                  Microsoft Edge
                </ExternalLink>
                .<br />
                We <strong>DO NOT SUPPORT SAFARI</strong> as they will delete
                all storage after seven days with no interaction.
              </>
            }
          />
        )}
      </section>
      <section className="landing-page__transcript-section">
        <TranscriptList />
      </section>
    </div>
  );
};
export default LandingPage;
