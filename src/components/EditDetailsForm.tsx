import React from "react";
import "./EditDetailsForm.css";
import { Cue, toTimeRangeString } from "../types/subtitles";
import { CueUpdate } from "../hooks/useCues";

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
  event.preventDefault();

const EditDetailsForm: React.FC<{
  selectedCue: Cue | null;
  saveCue: (cue: CueUpdate) => void;
}> = ({ selectedCue, saveCue }) => {
  const handleSaveCue = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedCue) {
      const lines = event.currentTarget.value.split(/\s*\n\s*/).filter(Boolean);
      saveCue({
        id: selectedCue.id,
        lines,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="edit-details-form">
      {selectedCue ? (
        <>
          <label htmlFor="cue-lines">Lines</label>
          <textarea
            id="cue-lines"
            key={selectedCue.id}
            className="edit-details-form__cue-lines"
            defaultValue={selectedCue.lines.join("\n")}
            onBlur={handleSaveCue}
          />
          <footer>{toTimeRangeString(selectedCue)}</footer>
        </>
      ) : (
        <p className="edit-details-form__no-selection">No cue selected</p>
      )}
    </form>
  );
};

export default EditDetailsForm;
