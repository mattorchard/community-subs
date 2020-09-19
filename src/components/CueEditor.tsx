import React, { useEffect } from "react";
import { Cue, toTimeRangeString } from "../types/subtitles";
import { SetCue } from "../hooks/useCues";
import { debounce } from "../helpers/timingHelpers";
import { matchScrollHeight } from "../helpers/domHelpers";
import "./CueEditor.css";

const CueEditor: React.FC<{
  cue: Cue;
  setCue: SetCue;
  selected: boolean;
}> = React.memo(
  ({ cue, setCue, selected }) => {
    const { id } = cue;
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      textAreaRef.current!.value = cue.text || "";
      matchScrollHeight(textAreaRef.current!);
      // Only intended to run on mount
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (selected) {
        textAreaRef.current!.focus();
      }
    }, [selected]);

    const {
      immediate: handleBlur,
      debounced: saveLinesDebounced,
    } = React.useMemo(
      () =>
        debounce(() => {
          setCue({
            id,
            text: textAreaRef.current!.value,
          });
        }, 2500),
      [id, setCue]
    );

    const handleChange = () => {
      matchScrollHeight(textAreaRef.current!);
      saveLinesDebounced();
    };

    return (
      <label className="cue-editor">
        <textarea
          id={cue.id}
          ref={textAreaRef}
          onChange={handleChange}
          onBlur={handleBlur}
          className="cue-editor__textarea"
          placeholder="Blank"
        />
        <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
      </label>
    );
  },
  (oldProps, newProps) =>
    oldProps.selected === newProps.selected && oldProps.cue === newProps.cue
);

export default CueEditor;
