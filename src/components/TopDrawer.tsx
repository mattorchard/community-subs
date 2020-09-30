import React, { useState } from "react";
import Modal from "react-modal";
import "./TopDrawer.css";
import { Transcript } from "../types/cue";
import DebouncedInput from "./DebouncedInput";
import { useTranscriptActions } from "../contexts/TranscriptContext";

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

const TopDrawer: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  transcript: Transcript;
}> = ({ isOpen, onRequestClose, transcript }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    className="top-drawer"
    overlayClassName="top-drawer__overlay"
  >
    <TranscriptNameInput transcript={transcript} />
    {/*Todo: Import */}
    {/*Todo: Export*/}
    {/*Todo: Show Dates*/}
  </Modal>
);

export default TopDrawer;
