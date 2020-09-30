import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  TranscriptUpdate,
  useTranscriptActions,
} from "../contexts/TranscriptContext";
import Spinner from "./Spinner";
import Thumbnail from "./Thumbnail";
import DebouncedInput from "./DebouncedInput";
import { toDateTimeString } from "../helpers/dateHelpers";
import AddVideoForm from "./AddVideoForm";
import { getThumbnailUrl } from "../helpers/entityHelpers";
import "./NewTranscriptPage.css";
import useTranscript from "../hooks/useTranscript";

const NewTranscriptPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { updateTranscript } = useTranscriptActions();
  const transcript = useTranscript();
  if (!transcript) {
    return <Spinner fadeIn>Loading Transcript</Spinner>;
  }
  if (transcript.video) {
    return <Redirect to={`/transcript/${transcript.id}`} />;
  }
  const handleSaveTranscript = async (transcript: TranscriptUpdate) => {
    try {
      setIsSaving(true);
      await updateTranscript(transcript);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="new-transcript-page">
      <header className="new-transcript-page__header">
        {transcript.video && (
          <Thumbnail url={getThumbnailUrl(transcript.video)} />
        )}

        <div className="new-transcript-page__header__content_info">
          <DebouncedInput
            className="input-flush xxxl"
            initialValue={transcript.name}
            disabled={isSaving}
            onValueChange={(name) =>
              handleSaveTranscript({ id: transcript.id, name })
            }
          />
          <time
            className="new-transcript-page__date"
            dateTime={transcript.createdAt.toISOString()}
          >
            {toDateTimeString(transcript.createdAt)}
          </time>
        </div>
      </header>
      <main>
        <AddVideoForm
          onSubmit={(video) =>
            handleSaveTranscript({ id: transcript.id, video })
          }
        />
      </main>
    </div>
  );
};

export default NewTranscriptPage;
