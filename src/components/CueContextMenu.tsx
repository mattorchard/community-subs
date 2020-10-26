import React, { useEffect, useRef } from "react";
import "./CueContextMenu.css";
import {
  useCueSelectionActions,
  useIsCueSelected,
  useSelectedCueIds,
} from "../contexts/CueSelectionContext";
import {
  faObjectGroup,
  faObjectUngroup,
  faStepBackward,
  faStepForward,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIsContainedBy } from "../helpers/domHelpers";
import { useCuesContext } from "../contexts/CuesContext";
import useSeekToCue from "../contexts/useSeekToCue";
import useShortcut from "../hooks/useShortcut";

const CueContextMenu: React.FC<{
  cueId: string;
  top: number;
  onRequestClose: () => void;
  left?: number;
  right?: number;
}> = ({ cueId, onRequestClose, ...position }) => {
  const selectedCueIds = useSelectedCueIds();
  const isSelected = useIsCueSelected(cueId);
  const {
    setSelection,
    removeFromSelection,
    clearSelection,
  } = useCueSelectionActions();
  const { deleteCues } = useCuesContext();
  const seekToCue = useSeekToCue();
  const menuRef = useRef<HTMLUListElement>(null!);

  useShortcut("escape", onRequestClose);

  useEffect(() => {
    menuRef.current.focus();
  }, [cueId]);

  const handleBlur = (event: React.FocusEvent) => {
    if (
      !event.relatedTarget ||
      !getIsContainedBy(event.currentTarget, event.relatedTarget as Node)
    )
      onRequestClose();
  };

  return (
    <ul
      key={cueId}
      className="cue-context-menu"
      style={{ ...position }}
      tabIndex={-1}
      ref={menuRef}
      onBlur={handleBlur}
      onClick={onRequestClose}
    >
      {isSelected ? (
        <li className="cue-context-menu__item">
          <button
            className="cue-context-menu__item__button"
            type="button"
            onClick={() => removeFromSelection(cueId)}
          >
            <FontAwesomeIcon icon={faObjectGroup} />
            Deselect this cue
          </button>
        </li>
      ) : (
        <li className="cue-context-menu__item">
          <button
            className="cue-context-menu__item__button"
            type="button"
            onClick={() => setSelection(cueId)}
          >
            <FontAwesomeIcon icon={faObjectUngroup} /> Select this cue
          </button>
        </li>
      )}

      <li className="cue-context-menu__item">
        <button
          className="cue-context-menu__item__button"
          type="button"
          onClick={() => seekToCue(cueId, "start")}
        >
          <FontAwesomeIcon icon={faStepBackward} /> Seek to start
        </button>
      </li>

      <li className="cue-context-menu__item">
        <button
          className="cue-context-menu__item__button"
          type="button"
          onClick={() => seekToCue(cueId, "end")}
        >
          <FontAwesomeIcon icon={faStepForward} /> Seek to end
        </button>
      </li>

      <li className="cue-context-menu__item">
        <button
          className="cue-context-menu__item__button cue-context-menu__item__button--danger"
          type="button"
          onClick={() => {
            deleteCues([cueId]);
            removeFromSelection(cueId);
          }}
        >
          <FontAwesomeIcon icon={faTrash} /> Delete this Cue
        </button>
      </li>

      {isSelected && selectedCueIds.size > 1 && (
        <li className="cue-context-menu__item">
          <button
            className="cue-context-menu__item__button cue-context-menu__item__button--danger"
            type="button"
            onClick={() => {
              deleteCues([...selectedCueIds]);
              clearSelection();
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} /> Delete {selectedCueIds.size}{" "}
            selected cues
          </button>
        </li>
      )}
    </ul>
  );
};
export default CueContextMenu;
