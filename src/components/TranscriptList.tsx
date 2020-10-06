import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AspectRatio from "./AspectRatio";
import Spinner from "./Spinner";
import Thumbnail from "./Thumbnail";
import {
  useTranscriptActions,
  useTranscripts,
} from "../contexts/TranscriptContext";
import "./TranscripttList.css";
import { getThumbnailUrl } from "../helpers/entityHelpers";

const TranscriptList: React.FC = () => {
  const history = useHistory();
  const transcripts = useTranscripts();
  const { createTranscript } = useTranscriptActions();
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateTranscript = async () => {
    try {
      setIsSaving(true);
      const transcript = await createTranscript();
      history.push(`/transcript/${transcript.id}/add-video`);
    } catch (error) {
      // Todo: Toast
      console.error("Create transcript failed", error);
      setIsSaving(false);
    }
  };
  return (
    <ol className="transcript-list">
      <AspectRatio as="li" ratio={9 / 16}>
        {isSaving ? (
          <Spinner size="xl">Creating new transcript</Spinner>
        ) : (
          <button
            type="button"
            className="transcript-list__create-transcript-button placeholder-button xl"
            onClick={handleCreateTranscript}
          >
            + New Transcript
          </button>
        )}
      </AspectRatio>

      {!transcripts && (
        <AspectRatio as="li" center ratio={9 / 16}>
          <Spinner size="xl" fadeIn>
            Loading transcripts
          </Spinner>
        </AspectRatio>
      )}

      {transcripts?.map((transcript) => (
        <li key={transcript.id}>
          <Link
            to={
              transcript.video
                ? `/transcript/${transcript.id}`
                : `/transcript/${transcript.id}/add-video`
            }
            className="transcript-list__item__link focus-outline"
          >
            <Thumbnail
              url={
                transcript.video ? getThumbnailUrl(transcript.video) : undefined
              }
            />
            <h3 className="transcript-link__title lg">{transcript.name}</h3>
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default TranscriptList;
