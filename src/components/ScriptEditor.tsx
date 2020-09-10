import React from "react";
import { CueMap, CueUpdate } from "../hooks/useCues";
import "./ScriptEditor.css";
import { Cue, toTimeRangeString } from "../types/subtitles";

const ScriptEditor: React.FC<{
  cues: CueMap;
  saveCue: (cue: CueUpdate) => void;
}> = ({ cues }) => (
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
          <CueEditor cue={cue} />
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

const CueEditor: React.FC<{ cue: Cue }> = ({ cue }) => (
  <div className="cue-editor">
    <textarea
      className="cue-editor__textarea"
      id={cue.id}
      placeholder="Blank"
    />
    <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
  </div>
);

export default ScriptEditor;
