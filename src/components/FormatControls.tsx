import React from "react";
import "./FormatControls.css";
import {
  faArrowsAlt,
  faBold,
  faItalic,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelectedCues } from "../contexts/CueSelectionContext";
import { useCuesContext } from "../contexts/CuesContext";
import useShortcut from "../hooks/useShortcut";
import { useMenu } from "../hooks/useMenu";
import { Alignment } from "../types/cue";
import PlacementIcon from "./PlacementIcon";

const placementOptions: {
  justify: Alignment;
  align: Alignment;
}[] = [
  {
    justify: "start",
    align: "start",
  },
  {
    justify: "center",
    align: "start",
  },
  {
    justify: "end",
    align: "start",
  },
  {
    justify: "start",
    align: "end",
  },
  {
    justify: "center",
    align: "end",
  },
  {
    justify: "end",
    align: "end",
  },
];

const FormatControls = () => {
  const selectedCues = useSelectedCues();
  const { updateCues } = useCuesContext();
  const placementMenu = useMenu();

  const setPlacement = (settings: { justify: Alignment; align: Alignment }) =>
    updateCues(selectedCues.map(({ id }) => ({ id, settings })));

  const toggleBold = () => {
    const allBold = selectedCues.every((cue) => cue.isBold);
    updateCues(selectedCues.map(({ id }) => ({ id, isBold: !allBold })));
  };
  const toggleItalics = () => {
    const allItalics = selectedCues.every((cue) => cue.isItalics);
    updateCues(selectedCues.map(({ id }) => ({ id, isItalics: !allItalics })));
  };

  useShortcut(
    "b",
    (event) => {
      event.preventDefault();
      toggleBold();
    },
    { ctrl: true }
  );

  useShortcut(
    "i",
    (event) => {
      event.preventDefault();
      toggleItalics();
    },
    { ctrl: true }
  );

  return (
    <div role="group" className="format-controls button-group with-dividers">
      <button
        className="icon-button"
        onClick={toggleBold}
        title="Bold (ctrl + B)"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        className="icon-button"
        onClick={toggleItalics}
        title="Italicize (ctrl + I)"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>

      <div {...placementMenu.containerProps} className="text-position-menu">
        <button
          {...placementMenu.buttonProps}
          className="icon-button format-controls__placement-button"
          title="Placement"
        >
          <FontAwesomeIcon icon={faArrowsAlt} />
        </button>
        {placementMenu.isMenuOpen && (
          <ol
            {...placementMenu.popupProps}
            className="text-position-menu__items"
          >
            {placementOptions.map((place, index) => (
              <li key={index}>
                <button onClick={() => setPlacement(place)}>
                  <PlacementIcon justify={place.justify} align={place.align} />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default FormatControls;
