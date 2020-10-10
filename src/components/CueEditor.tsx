import React, { CSSProperties, useEffect } from "react";
import { Cue } from "../types/cue";
import { debounce } from "../helpers/timingHelpers";
import { getClassName, matchScrollHeight } from "../helpers/domHelpers";
import "./CueEditor.css";
import { toTimeRangeString } from "../helpers/timeCodeHelpers";
import { getLineCount } from "../helpers/textHelpers";
import { useCueSelectionActions } from "../contexts/CueSelectionContext";
import { useModifierKeys } from "../contexts/ModifierKeysContext";
import { useCuesContext } from "../contexts/CuesContext";
import GroupIcon from "./GroupIcon";

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
  isSelected: boolean;
  shouldFocus: number | null;
  onArrowOutUp: (cueId: string) => void;
  onArrowOutDown: (cueId: string) => void;
}> = React.memo(
  ({ cue, isSelected, shouldFocus, onArrowOutUp, onArrowOutDown }) => {
    const modifierKeysRef = useModifierKeys();
    const { setSelection, addToSelection } = useCueSelectionActions();
    const { id } = cue;
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const { updateCue } = useCuesContext();

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
          updateCue({
            id,
            text: textAreaRef.current!.value,
          });
        }, 2500),
      [id, updateCue]
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
        style={
          {
            "--primary-group-color": `var(--color-group-${cue.group}-primary)`,
            "--secondary-group-color": `var(--color-group-${cue.group}-secondary)`,
          } as CSSProperties
        }
      >
        <textarea
          id={cue.id}
          ref={textAreaRef}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => {
            if (modifierKeysRef.current.ctrl) {
              addToSelection(cue.id);
            } else if (!isSelected) {
              setSelection(cue.id);
            }
          }}
          onKeyDown={onKeyDown}
          className="cue-editor__textarea"
          placeholder="Blank"
        />
        <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
        <GroupIcon className="cue-editor__group" groupName={cue.group} />
      </label>
    );
  },
  (oldProps, newProps) =>
    oldProps.isSelected === newProps.isSelected &&
    oldProps.cue === newProps.cue &&
    oldProps.shouldFocus === newProps.shouldFocus
);

export default CueEditor;
