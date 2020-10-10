import React from "react";
import { Redirect } from "react-router-dom";
import { useTranscriptActions } from "../contexts/TranscriptContext";
import Spinner from "./Spinner";
import DebouncedInput from "./DebouncedInput";
import { toDateTimeString } from "../helpers/dateHelpers";
import AddVideoForm from "./AddVideoForm";
import "./NewTranscriptPage.css";
import useTranscript from "../hooks/useTranscript";
import { TranscriptPatch } from "../repositories/EntityRepository";
import useAsyncSafeState from "../hooks/useAsyncSafeState";

const NewTranscriptPage = () => {
  const [isSaving, setIsSaving] = useAsyncSafeState(false);
  const { updateTranscript } = useTranscriptActions();
  const transcript = useTranscript();
  if (!transcript) {
    return <Spinner fadeIn>Loading Transcript</Spinner>;
  }
  if (transcript.video) {
    return <Redirect to={`/transcript/${transcript.id}`} />;
  }
  const handleSaveTranscript = async (transcript: TranscriptPatch) => {
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
        <div className="new-transcript-page__header__info">
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
