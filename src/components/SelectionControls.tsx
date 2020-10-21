import React from "react";
import {
  useCueSelectionActions,
  useSelectedCueIds,
} from "../contexts/CueSelectionContext";
import "./SelectionControls.css";
import {
  faCaretDown,
  faCompressArrowsAlt,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { useCuesContext } from "../contexts/CuesContext";
import { useScrollToSelection } from "../contexts/StudioScrollContext";
import { useMenu } from "../hooks/useMenu";

const getSelectionMessage = (size: number) => {
  if (size === 0) {
    return "No selection";
  } else if (size === 1) {
    return "Selected 1 cue";
  } else {
    return `Selected ${size} cues`;
  }
};

const SelectionControls = () => {
  const selection = useSelectedCueIds();
  const { setSelection } = useCueSelectionActions();
  const { deleteCues } = useCuesContext();
  const scrollToSelection = useScrollToSelection();
  const { isMenuOpen, buttonProps, popupProps, containerProps } = useMenu();

  const deselectCues = () => setSelection(new Set());

  const deleteSelection = () => {
    deleteCues([...selection]);
    deselectCues();
  };

  return (
    <div {...containerProps} className="selection-controls">
      <Button
        {...buttonProps}
        className="selection-controls__button"
        rightIcon
        disabled={selection.size === 0}
      >
        {getSelectionMessage(selection.size)}{" "}
        <FontAwesomeIcon icon={faCaretDown} />
      </Button>
      {isMenuOpen && (
        <ul {...popupProps} className="selection-controls__menu">
          <li className="menu-item">
            <button className="menu-item__button" onClick={deselectCues}>
              <FontAwesomeIcon icon={faTimesCircle} />
              Deselect
            </button>
          </li>
          <li className="menu-item">
            <button className="menu-item__button" onClick={scrollToSelection}>
              <FontAwesomeIcon icon={faCompressArrowsAlt} />
              Scroll To
            </button>
          </li>
          <li className="menu-item">
            <button
              className="menu-item__button menu-item__button--danger"
              onClick={deleteSelection}
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SelectionControls;
