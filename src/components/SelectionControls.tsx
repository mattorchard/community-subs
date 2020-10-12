import React, { useRef, useState } from "react";
import {
  useCueSelection,
  useCueSelectionActions,
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
import useWindowEvent from "../hooks/useWindowEvent";
import { getIsContainedBy } from "../helpers/domHelpers";
import { useCuesContext } from "../contexts/CuesContext";

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
  const selection = useCueSelection();
  const { setSelection } = useCueSelectionActions();
  const { deleteCues } = useCuesContext();

  const containerRef = useRef<HTMLDivElement>(null!);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useWindowEvent("click", () => setIsMenuOpen(false));

  const deselectCues = () => setSelection(new Set());

  const scrollToSelection = () => {};

  const deleteSelection = () => {
    deleteCues([...selection]);
    deselectCues();
  };

  return (
    <div
      className="selection-controls"
      ref={containerRef}
      onBlur={(event) => {
        if (!getIsContainedBy(event.currentTarget, event.target)) {
          setIsMenuOpen(false);
        }
      }}
    >
      <Button
        className="selection-controls__button"
        rightIcon
        disabled={selection.size === 0}
        onClick={(event) => {
          event.stopPropagation();
          setIsMenuOpen((isOpen) => !isOpen);
        }}
      >
        {getSelectionMessage(selection.size)}{" "}
        <FontAwesomeIcon icon={faCaretDown} />
      </Button>
      {isMenuOpen && (
        <ul className="selection-controls__menu">
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
