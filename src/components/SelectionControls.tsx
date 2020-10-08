import React from "react";
import {
  useCueSelection,
  useCueSelectionActions,
} from "../contexts/CueSelectionContext";
import "./SelectionControls.css";
import {
  faArrowsAltH,
  faArrowsAltV,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  return (
    <div className="selection-controls button-group with-dividers">
      <span className="selection-controls__label">
        {getSelectionMessage(selection.size)}
      </span>
      <button
        className="selection-controls__button icon-button"
        disabled={selection.size === 0}
        title="Scroll to selection in Timeline"
      >
        <FontAwesomeIcon icon={faArrowsAltH} />
      </button>
      <button
        className="selection-controls__button icon-button"
        disabled={selection.size === 0}
        title="Scroll to selection in Script"
      >
        <FontAwesomeIcon icon={faArrowsAltV} />
      </button>
      <button
        className="selection-controls__button icon-button selection-controls__button--deselect"
        disabled={selection.size === 0}
        title="Deselect"
        onClick={() => setSelection(new Set())}
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </div>
  );
};

export default SelectionControls;
