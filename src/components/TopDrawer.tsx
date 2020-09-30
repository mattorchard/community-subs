import React, { useState } from "react";
import Modal from "react-modal";
import "./TopDrawer.css";
import { Transcript } from "../types/cue";
import DebouncedInput from "./DebouncedInput";
import { useTranscriptActions } from "../contexts/TranscriptContext";
import Button from "./Button";
import { toDateTimeString } from "../helpers/dateHelpers";
import FileDropTarget from "./FileDropTarget";
import { fromVtt } from "../helpers/importHelpers";
import { readAsText } from "../helpers/fileHelpers";
import { putCuesBulk } from "../repositories/EntityRepository";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TranscriptNameInput: React.FC<{ transcript: Transcript }> = ({
  transcript,
}) => {
  const { updateTranscript } = useTranscriptActions();
  const [isSaving, setIsSaving] = useState(false);
  return (
    <DebouncedInput
      initialValue={transcript.name}
      disabled={isSaving}
      onValueChange={async (name) => {
        try {
          setIsSaving(true);
          await updateTranscript({ id: transcript.id, name });
        } finally {
          setIsSaving(false);
        }
      }}
      className="input-flush xxxl"
    />
  );
};

const ImportCueArea: React.FC<{ transcriptId: string }> = ({
  transcriptId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  return (
    <FileDropTarget
      buttonLabel="Choose a transcript to import"
      dropLabel="Or drag an drop one"
      accept="text/*"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onDrop={async (files) => {
        const [file] = files;
        if (!file) {
          return;
        }
        setErrorMessage("");
        try {
          setIsLoading(true);
          const cues = fromVtt(transcriptId, await readAsText(file));
          await putCuesBulk(cues);

          // Todo: Fix this disgusting hack
          window.location.reload();
        } catch (error) {
          setErrorMessage("Error loading file");
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
};

const TopDrawer: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  transcript: Transcript;
  onRequestExport: () => void;
}> = ({ isOpen, onRequestClose, transcript, onRequestExport }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    className="top-drawer"
    overlayClassName="top-drawer__overlay"
  >
    <button
      className="top-drawer-close"
      title="Close top drawer"
      onClick={onRequestClose}
    >
      <FontAwesomeIcon icon={faChevronUp} />
    </button>
    <div className="top-drawer__content">
      <header className="top-drawer__header">
        <TranscriptNameInput transcript={transcript} />

        <Button onClick={onRequestExport}>Export as WebVTT</Button>
      </header>

      <time
        className="top-drawer__date"
        dateTime={transcript.createdAt.toISOString()}
      >
        Created {toDateTimeString(transcript.createdAt)}
      </time>
      <time
        className="top-drawer__date"
        dateTime={transcript.createdAt.toISOString()}
      >
        Accessed {toDateTimeString(transcript.accessedAt)}
      </time>

      <ImportCueArea transcriptId={transcript.id} />
    </div>
  </Modal>
);

export default TopDrawer;
