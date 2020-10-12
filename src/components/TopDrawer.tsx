import React from "react";
import Modal from "react-modal";
import "./TopDrawer.css";
import { Transcript } from "../types/cue";
import DebouncedInput from "./DebouncedInput";
import { useTranscriptActions } from "../contexts/TranscriptContext";
import Button from "./Button";
import { toDateTimeString } from "../helpers/dateHelpers";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAsyncSafeState from "../hooks/useAsyncSafeState";

const TranscriptNameInput: React.FC<{ transcript: Transcript }> = ({
  transcript,
}) => {
  const { updateTranscript } = useTranscriptActions();
  const [isSaving, setIsSaving] = useAsyncSafeState(false);
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

      {/* Todo: Add a way to import additional items, even if some cues are present */}
    </div>
  </Modal>
);

export default TopDrawer;
