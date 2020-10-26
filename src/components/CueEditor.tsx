import React, { useEffect } from "react";
import { Cue } from "../types/cue";
import { debounce } from "../helpers/timingHelpers";
import {
  getClassName,
  matchScrollHeight,
  queryAncestor,
} from "../helpers/domHelpers";
import "./CueEditor.css";
import { toTimeRangeString } from "../helpers/timeCodeHelpers";
import { getLineCount } from "../helpers/textHelpers";
import { useCueSelectionActions } from "../contexts/CueSelectionContext";
import { useModifierKeys } from "../contexts/ModifierKeysContext";
import { useCuesContext } from "../contexts/CuesContext";
import PlacementIcon from "./PlacementIcon";
import useCueContextMenu from "../hooks/useCueContextMenu";

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

const isCustomPlacement = ({
  align,
  justify,
}: {
  align: string;
  justify: string;
}) => align !== "end" || justify !== "center";

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
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null!);
    const { updateCue } = useCuesContext();
    const { contextMenu, openContextMenu } = useCueContextMenu();

    const onContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      const cueElement = queryAncestor(event.target as Node, "[data-cue-id]");

      const cueId = cueElement?.dataset.cueId;
      if (!cueId) return;

      const { width: cueEditorWidth } = cueElement!.getBoundingClientRect();
      const offsetX = event.nativeEvent.offsetX;
      const isClickOnLeft = offsetX < cueEditorWidth / 2;
      if (isClickOnLeft) {
        openContextMenu({
          left: offsetX,
          top: event.nativeEvent.offsetY,
          cueId,
        });
      } else {
        openContextMenu({
          right: cueEditorWidth - offsetX,
          top: event.nativeEvent.offsetY,
          cueId,
        });
      }
    };

    useEffect(() => {
      textAreaRef.current.value = cue.text || "";
      matchScrollHeight(textAreaRef.current);
      // Only intended to run on mount
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (shouldFocus) {
        textAreaRef.current.focus({ preventScroll: true });
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
            text: textAreaRef.current.value,
          });
        }, 2500),
      [id, updateCue]
    );

    const handleChange = () => {
      if (getLineCount(textAreaRef.current.value) !== getLineCount(cue.text)) {
        matchScrollHeight(textAreaRef.current);
        saveImmediate();
      } else {
        saveTextDebounced();
      }
    };
    const handleBlur = () => {
      if (textAreaRef.current.value !== cue.text) {
        saveImmediate();
      }
    };

    const onKeyDown = onArrowOut(
      () => onArrowOutUp(cue.id),
      () => onArrowOutDown(cue.id)
    );

    return (
      <div
        className={getClassName("cue-editor", {
          "is-selected": isSelected,
          "is-bold": cue.isBold,
          "is-italics": cue.isItalics,
        })}
        data-cue-id={cue.id}
        onClick={() => textAreaRef.current.focus()}
        onContextMenu={onContextMenu}
      >
        {contextMenu}
        <textarea
          id={cue.id}
          ref={textAreaRef}
          aria-label={`Cue text${cue.isBold ? ", bolded" : ""}${
            cue.isItalics ? ", italicized" : ""
          }`}
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
        <div className="cue-editor__format-info">
          {cue.settings && isCustomPlacement(cue.settings) && (
            <PlacementIcon
              justify={cue.settings.justify}
              align={cue.settings.align}
            />
          )}
        </div>
      </div>
    );
  },
  (oldProps, newProps) =>
    oldProps.isSelected === newProps.isSelected &&
    oldProps.cue === newProps.cue &&
    oldProps.shouldFocus === newProps.shouldFocus
);

export default CueEditor;
