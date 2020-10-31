import React, { useEffect, useMemo, useState } from "react";
import { Cue } from "../types/cue";
import { debounce } from "../helpers/timingHelpers";
import { getClassName, queryAncestor } from "../helpers/domHelpers";
import "./CueEditor.css";
import { toTimeRangeString } from "../helpers/timeCodeHelpers";
import { getLineCount } from "../helpers/textHelpers";
import { useCueSelectionActions } from "../contexts/CueSelectionContext";
import { useModifierKeys } from "../contexts/ModifierKeysContext";
import { useCuesContext } from "../contexts/CuesContext";
import useCueContextMenu, { MenuDetails } from "../hooks/useCueContextMenu";
import netlixEnglishLinter from "../linters/netflixEnglish";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getViolationAnnotations,
  ViolationAnnotation,
} from "../helpers/linterHelpers";
import Button from "./Button";

const linter = netlixEnglishLinter;

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

const getHandleContextMenu = (
  openContextMenu: (details: MenuDetails) => void
) => (event: React.MouseEvent) => {
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

const matchScrollHeight = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = `${getLineCount(textarea.value)}rem`;
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
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null!);
    const { updateCue } = useCuesContext();
    const { contextMenu, openContextMenu } = useCueContextMenu();
    const [draft, setDraft] = useState(cue.text);

    const [violations, annotations] = useMemo(() => {
      const violations = linter.getViolations({ ...cue, text: draft });
      const annotations = getViolationAnnotations(draft, violations);
      return [violations, annotations];
    }, [draft, cue]);

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

    useEffect(() => setDraft(cue.text), [cue]);

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
      const value = textAreaRef.current.value;
      setDraft(value);
      if (getLineCount(value) !== getLineCount(cue.text)) {
        matchScrollHeight(textAreaRef.current);
        saveImmediate();
      } else {
        saveTextDebounced();
      }
    };

    const handleBlur = () => {
      if (textAreaRef.current.value !== cue.text) saveImmediate();
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
        onClick={(event) => {
          if (!queryAncestor(event.target as Node, ".syntax"))
            textAreaRef.current.focus();
        }}
        onContextMenu={getHandleContextMenu(openContextMenu)}
      >
        {contextMenu}
        <div className="cue-editor__text-container">
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
            onPointerDown={(event) => {
              if (event.button === 2) event.preventDefault();
            }}
            onKeyDown={onKeyDown}
            className="cue-editor__textarea"
            placeholder="Blank"
          />
          <div aria-hidden className="cue-editor__syntax-highlighter">
            {annotations.map((annotation, index) => {
              const hasViolations = annotation.violations.length > 0;
              return (
                <span
                  key={index}
                  className={getClassName("syntax", {
                    violation: hasViolations,
                    clear: !hasViolations,
                  })}
                  tabIndex={hasViolations ? -1 : 0}
                >
                  {hasViolations && (
                    <AnnotationPopup
                      annotation={annotation}
                      cue={cue}
                      onFix={console.log}
                    />
                  )}
                  {annotation.text}
                </span>
              );
            })}
          </div>
        </div>
        <small className="cue-editor__footer">{toTimeRangeString(cue)}</small>
        {violations.length > 0 && (
          <div
            className="cue-editor__violations"
            title={`${violations.length} rule violation${
              violations.length > 1 ? "s" : ""
            }`}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
        )}
      </div>
    );
  },
  (oldProps, newProps) =>
    oldProps.isSelected === newProps.isSelected &&
    oldProps.cue === newProps.cue &&
    oldProps.shouldFocus === newProps.shouldFocus
);

const AnnotationPopup: React.FC<{
  annotation: ViolationAnnotation;
  cue: Cue;
  onFix: (cue: Cue) => void;
}> = ({ annotation, cue, onFix }) => (
  <ul className="annotation-popup">
    {annotation.violations.map((violation, index) => (
      <li key={index}>
        <strong>{violation.rule.name}</strong>
        <p>{violation.rule.description}</p>
        {violation.rule.fix && (
          <Button onClick={() => onFix(violation.rule.fix!(cue, violation))}>
            Fix
          </Button>
        )}
      </li>
    ))}
  </ul>
);

export default CueEditor;
