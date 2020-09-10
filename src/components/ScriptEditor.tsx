import React, { useEffect } from "react";
import { CueMap, CueUpdate } from "../hooks/useCues";
import "./ScriptEditor.css";
import { Cue, toTimeRangeString } from "../types/subtitles";

const ScriptEditor: React.FC<{
  selectedCue: string | null;
  cues: CueMap;
  saveCue: (cue: CueUpdate) => void;
}> = ({ cues, selectedCue }) => (
  <section className="script-editor">
    <ol className="script-editor__cue-list">
      {[...cues.values()].map((cue, index) => (
        <li key={cue.id}>
          {index === 0 && (
            <button
              type="button"
              title="Add cue before"
              className="script-editor__add-cue-between-button"
            >
              +
            </button>
          )}
          <CueEditor cue={cue} isSelected={selectedCue === cue.id} />
          <button
            type="button"
            title="Add cue between"
            className="script-editor__add-cue-between-button"
          >
            +
          </button>
        </li>
      ))}
    </ol>
  </section>
);

const CueEditor: React.FC<{ cue: Cue; isSelected: boolean }> = ({
  cue,
  isSelected,
}) => {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isSelected) {
      areaRef.current?.scrollIntoView(true);
      areaRef.current?.focus();
    }
  }, [isSelected]);
  return (
    <div className="cue-editor">
      <textarea
        ref={areaRef}
        className="cue-editor__textarea"
        placeholder="Blank"
      />
      <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
    </div>
  );
};

export default ScriptEditor;
