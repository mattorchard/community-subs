import React from "react";
import { SetCue } from "../hooks/useCues";
import "./ScriptEditor.css";
import CueEditor from "./CueEditor";
import { Cue } from "../types/subtitles";

const TARGET_DURATION = 2500;
const MIN_DURATION = 1000;

const ScriptEditor: React.FC<{
  cues: Cue[];
  setCue: SetCue;
  duration: number;
  selectedCue: string | null;
  onSelectCue: (cueId: string) => void;
}> = ({ cues, setCue, duration, selectedCue }) => {
  const handleAddBeforeAll = () => {
    const cueBefore = cues[0];
    if (cueBefore.start < MIN_DURATION) {
      alert("No room to add in a cue before that");
    } else {
      setCue({
        start: Math.max(0, cueBefore.start - TARGET_DURATION),
        end: cueBefore.start,
        text: "",
        layer: cueBefore.layer,
      });
    }
  };
  const handleAddBetween = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = parseInt(event.currentTarget.dataset.index!);
    const cueBefore = cues[index];
    const cueAfter: Cue | undefined = cues[index + 1];
    if (cueBefore.end > duration - MIN_DURATION) {
      alert("No room to add in a cue after that");
    } else if (!cueAfter) {
      setCue({
        start: cueBefore.end,
        end: Math.min(cueBefore.end + TARGET_DURATION, duration - MIN_DURATION),
        text: "",
        layer: cueBefore.layer,
      });
    } else if (cueAfter.start - cueBefore.end < MIN_DURATION) {
      alert("No room to add in a cue between");
    } else {
      setCue({
        start: cueBefore.end,
        end: cueAfter.start,
        text: "",
        layer: cueBefore.layer,
      });
    }
  };
  return (
    <section className="script-editor">
      <ol className="script-editor__cue-list">
        {cues.map((cue, index) => (
          <li key={cue.id}>
            {index === 0 && (
              <button
                type="button"
                className="script-editor__add-cue-between-button"
                onClick={handleAddBeforeAll}
              >
                Add Before
              </button>
            )}
            <CueEditor
              cue={cue}
              setCue={setCue}
              selected={selectedCue === cue.id}
            />
            <button
              type="button"
              className="script-editor__add-cue-between-button"
              data-index={index}
              onClick={handleAddBetween}
            >
              {index < cues.length - 1 ? "Add Between" : "Add After"}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ScriptEditor;
