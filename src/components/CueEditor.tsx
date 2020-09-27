import React, { useEffect } from "react";
import { Cue } from "../types/cue";
import { SetCue } from "../hooks/useCues";
import { debounce } from "../helpers/timingHelpers";
import { matchScrollHeight } from "../helpers/domHelpers";
import "./CueEditor.css";
import { toTimeRangeString } from "../helpers/timeCodeHelpers";

type KE = React.KeyboardEvent<HTMLTextAreaElement>;

const onArrowOut = (onUp: (event: KE) => void, onDown: (event: KE) => void) => (
  event: KE
) => {
  const { key, currentTarget } = event;
  if (key !== "ArrowUp" && key !== "ArrowDown") {
    return;
  }
  const { selectionStart, selectionEnd } = currentTarget;
  if (selectionStart !== selectionEnd) {
    return;
  }
  if (key === "ArrowUp" && selectionStart === 0) {
    return onUp(event);
  }
  if (key === "ArrowDown" && selectionStart === currentTarget.value.length) {
    return onDown(event);
  }
};

const CueEditor: React.FC<{
  cue: Cue;
  setCue: SetCue;
  selected: boolean;
  onSelectPrevious: (cueId: string) => void;
  onSelectNext: (cueId: string) => void;
}> = React.memo(
  ({ cue, setCue, selected, onSelectPrevious, onSelectNext }) => {
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

    const onKeyDown = onArrowOut(
      () => onSelectPrevious(cue.id),
      () => onSelectNext(cue.id)
    );

    return (
      <label className="cue-editor">
        <textarea
          id={cue.id}
          ref={textAreaRef}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
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
