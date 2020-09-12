import React from "react";
import { SaveCue } from "../hooks/useCues";
import "./ScriptEditor.css";
import CueEditor from "./CueEditor";
import { Cue } from "../types/subtitles";

const ScriptEditor: React.FC<{
  cues: Cue[];
  saveCue: SaveCue;
}> = ({ cues, saveCue }) => (
  <section className="script-editor">
    <ol className="script-editor__cue-list">
      {cues.map((cue, index) => (
        <li key={cue.id}>
          {index === 0 && (
            <button
              type="button"
              className="script-editor__add-cue-between-button"
            >
              Add Before
            </button>
          )}
          <CueEditor cue={cue} saveCue={saveCue} />
          <button
            type="button"
            className="script-editor__add-cue-between-button"
          >
            {index < cues.length - 1 ? "Add Between" : "Add After"}
          </button>
        </li>
      ))}
    </ol>
  </section>
);

export default ScriptEditor;
