import React, { useEffect } from "react";
import { Cue } from "../types/cue";
import { SetCue } from "../hooks/useCues";
import { debounce } from "../helpers/timingHelpers";
import { getClassName, matchScrollHeight } from "../helpers/domHelpers";
import "./CueEditor.css";
import { toTimeRangeString } from "../helpers/timeCodeHelpers";
import { getLineCount } from "../helpers/textHelpers";
import { useCueSelectionActions } from "../contexts/CueSelectionContext";

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
  isSelected: boolean;
  shouldFocus: number | null;
  onArrowOutUp: (cueId: string) => void;
  onArrowOutDown: (cueId: string) => void;
}> = React.memo(
  ({ cue, setCue, isSelected, shouldFocus, onArrowOutUp, onArrowOutDown }) => {
    const { setSelection } = useCueSelectionActions();
    const { id } = cue;
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      textAreaRef.current!.value = cue.text || "";
      matchScrollHeight(textAreaRef.current!);
      // Only intended to run on mount
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (shouldFocus) {
        textAreaRef.current!.focus();
      }
    }, [shouldFocus]);

    const {
      immediate: saveImmediate,
      debounced: saveTextDebounced,
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
      if (getLineCount(textAreaRef.current!.value) !== getLineCount(cue.text)) {
        matchScrollHeight(textAreaRef.current!);
        saveImmediate();
      } else {
        saveTextDebounced();
      }
    };
    const handleBlur = () => {
      if (textAreaRef.current!.value !== cue.text) {
        saveImmediate();
      }
    };

    const onKeyDown = onArrowOut(
      () => onArrowOutUp(cue.id),
      () => onArrowOutDown(cue.id)
    );

    return (
      <label
        className={getClassName("cue-editor", { "is-selected": isSelected })}
      >
        <textarea
          id={cue.id}
          ref={textAreaRef}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => {
            if (!isSelected) setSelection(cue.id);
          }}
          onKeyDown={onKeyDown}
          className="cue-editor__textarea"
          placeholder="Blank"
        />
        <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
      </label>
    );
  },
  (oldProps, newProps) =>
    oldProps.isSelected === newProps.isSelected &&
    oldProps.cue === newProps.cue &&
    oldProps.shouldFocus === newProps.shouldFocus
);

export default CueEditor;
