import React from "react";
import { CueMap, CueUpdate } from "../hooks/useCues";
import "./ScriptEditor.css";
import CueEditor from "./CueEditor";

const ScriptEditor: React.FC<{
  cues: CueMap;
  saveCue: (cue: CueUpdate) => void;
}> = ({ cues, saveCue }) => (
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
          <CueEditor cue={cue} saveCue={saveCue} />
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

export default ScriptEditor;
