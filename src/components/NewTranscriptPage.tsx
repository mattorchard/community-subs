import React, { useMemo, useState } from "react";
import { Redirect } from "react-router-dom";
import { useTranscriptMatch } from "../hooks/RouteHooks";
import {
  TranscriptUpdate,
  useTranscriptActions,
  useTranscripts,
} from "../contexts/TranscriptContext";
import Spinner from "./Spinner";
import Thumbnail from "./Thumbnail";
import DebouncedInput from "./DebouncedInput";
import { toDateTimeString } from "../helpers/dateHelpers";
import AddVideoForm from "./AddVideoForm";
import { getThumbnailUrl } from "../helpers/entityHelpers";
import "./NewTranscriptPage.css";

const useTranscript = () => {
  const transcriptId = useTranscriptMatch();
  const transcripts = useTranscripts();

  return useMemo(() => {
    if (!transcripts) {
      return null;
    }
    const transcript = transcripts.find(
      (transcript) => transcript.id === transcriptId
    );
    if (!transcript) {
      throw new Error(`No transcript with ID ${transcriptId}`);
    }
    return transcript;
  }, [transcriptId, transcripts]);
};

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
            initialValue={transcript.name}
            disabled={isSaving}
            onValueChange={(name) =>
              handleSaveTranscript({ id: transcript.id, name })
            }
            className="new-transcript-page__name-input"
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
