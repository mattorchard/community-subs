import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranscripts } from "../hooks/ProjectRepositoryHooks";
import { createTranscript } from "../repositories/ProjectRepository";
import "./TranscriptList.css";
import Spinner from "./Spinner";

const TranscriptList: React.FC<{ projectId: string }> = ({ projectId }) => {
  const history = useHistory();
  const [creatingTranscript, setCreatingTranscript] = useState(false);
  const { transcripts, loading: loadingTranscripts, error } = useTranscripts(
    projectId
  );
  if (error && !loadingTranscripts) {
    // Todo: Proper error message styles
    return <p>Uh-oh unable to get Project list {error!.message}</p>;
  }
  return (
    <ol className="transcript-list">
      <li className="transcript-list__item">
        {creatingTranscript ? (
          <Spinner size="xl">Creating new transcript</Spinner>
        ) : (
          <button
            className="transcript-list__add-transcript-button placeholder-button xl"
            onClick={async () => {
              try {
                setCreatingTranscript(true);
                const transcript = await createTranscript(projectId);
                history.push(`/studio/${projectId}/${transcript.id}`);
              } catch (error) {
                // Todo: Toast
                console.error("Unable to create transcript", error);
                setCreatingTranscript(false);
              }
            }}
          >
            + New Transcript
          </button>
        )}
      </li>
      {loadingTranscripts && (
        <li className="transcript-list__item">
          <Spinner size="xl" fadeIn>
            Loading transcripts
          </Spinner>
        </li>
      )}
      {transcripts?.map((transcript) => (
        <li key={transcript.id} className="transcript-list__item">
          <Link
            to={`/studio/${projectId}/${transcript.id}`}
            className="transcript-list__item__link"
          >
            {transcript.name} ({transcript.language})
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default TranscriptList;
