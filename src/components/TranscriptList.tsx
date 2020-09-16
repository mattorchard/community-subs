import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranscripts } from "../hooks/ProjectRepositoryHooks";
import { createTranscript } from "../repositories/ProjectRepository";

const TranscriptList: React.FC<{ projectId: string }> = ({ projectId }) => {
  const history = useHistory();
  const { transcripts } = useTranscripts(projectId);
  return (
    <ol>
      <li>
        <button
          onClick={() =>
            createTranscript(projectId).then((transcript) =>
              history.push(`/studio/${projectId}/${transcript.id}`)
            )
          }
        >
          + New Transcript
        </button>
      </li>
      {transcripts?.map((transcript) => (
        <li key={transcript.id}>
          <Link to={`/studio/${projectId}/${transcript.id}`}>
            {transcript.name} ({transcript.language})
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default TranscriptList;
