import React, { useEffect } from "react";
import { Cue, toTimeRangeString } from "../types/subtitles";
import { CueUpdate } from "../hooks/useCues";
import "./CueEditor.css";
import { debounce } from "../helpers/timingHelpers";

const CueEditor: React.FC<{
  cue: Cue;
  saveCue: (cue: CueUpdate) => void;
}> = ({ cue, saveCue }) => {
  const { id } = cue;
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current!.value = cue.lines.join("\n");
    // Only intended to run on mount
    // eslint-disable-next-line
  }, []);

  const { immediate: handleBlur, debounced: handleChange } = React.useMemo(
    () =>
      debounce(() => {
        saveCue({
          id,
          lines: textAreaRef.current!.value.split("\n"),
        });
      }, 2500),
    [id, saveCue]
  );

  return (
    <div className="cue-editor">
      <textarea
        id={cue.id}
        ref={textAreaRef}
        onChange={handleChange}
        onBlur={handleBlur}
        className="cue-editor__textarea"
        placeholder="Blank"
      />
      <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
    </div>
  );
};

export default CueEditor;
