import React from "react";
import "./FormatControls.css";
import { faBold, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupIcon from "./GroupIcon";
import { useToolsContext } from "../contexts/ToolsContext";
import { GroupName } from "../types/Groups";
import { getClassName } from "../helpers/domHelpers";
import { useSelectedCueIds } from "../contexts/CueSelectionContext";
import { useCuesContext } from "../contexts/CuesContext";
import useShortcut from "../hooks/useShortcut";
import { Cue } from "../types/cue";

const getSelectedCues = (
  cueSelection: Set<string>,
  cues: Cue[],
  cueIndexById: Map<string, number>
) => {
  const selectedCues: Cue[] = [];
  cueSelection.forEach((cueId) => {
    selectedCues.push(cues[cueIndexById.get(cueId)!]);
  });
  return selectedCues;
};

const FormatControls = () => {
  const { selectedGroup, setSelectedGroup } = useToolsContext();
  const cueSelection = useSelectedCueIds();
  const { updateCues, cues, cueIndexById } = useCuesContext();

  const toggleBold = () => {
    const selectedCues = getSelectedCues(cueSelection, cues, cueIndexById);
    const allBold = selectedCues.every((cue) => cue.isBold);
    updateCues(selectedCues.map((cue) => ({ id: cue.id, isBold: !allBold })));
  };
  const toggleItalics = () => {
    const selectedCues = getSelectedCues(cueSelection, cues, cueIndexById);
    const allItalics = selectedCues.every((cue) => cue.isItalics);
    updateCues(
      selectedCues.map((cue) => ({ id: cue.id, isItalics: !allItalics }))
    );
  };

  const setGroup = (group: GroupName) => {
    setSelectedGroup(group);
    updateCues([...cueSelection].map((id) => ({ id, group })));
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

  useShortcut(
    "!", // 1, with shift
    (event) => {
      event.preventDefault();
      setGroup("square");
    },
    { ctrl: true, shift: true }
  );
  useShortcut(
    "@", // 2 with shift
    (event) => {
      event.preventDefault();
      setGroup("circle");
    },
    { ctrl: true, shift: true }
  );
  useShortcut(
    "#", // 3 with shift
    (event) => {
      event.preventDefault();
      setGroup("triangle");
    },
    { ctrl: true, shift: true }
  );

  return (
    <div role="group" className="format-controls button-group with-dividers">
      <button
        className="icon-button"
        onClick={toggleBold}
        title="Bold selected"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        className="icon-button"
        onClick={toggleItalics}
        title="Italicize selected"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>

      <SelectGroupButton
        title="Set group to Square (ctrl + shift + 1)"
        group="square"
        selectedGroup={selectedGroup}
        onChange={setGroup}
      />
      <SelectGroupButton
        title="Set group to Circle (ctrl + shift + 2)"
        group="circle"
        selectedGroup={selectedGroup}
        onChange={setGroup}
      />
      <SelectGroupButton
        title="Set group to Triangle (ctrl + shift + 3)"
        group="triangle"
        selectedGroup={selectedGroup}
        onChange={setGroup}
      />
    </div>
  );
};

const SelectGroupButton: React.FC<{
  title: string;
  group: GroupName;
  selectedGroup: GroupName;
  onChange: (group: GroupName) => void;
}> = ({ title, group, selectedGroup, onChange }) => (
  <label
    title={title}
    className={getClassName(
      "color-button",
      { [group]: true, "is-selected": group === selectedGroup },
      "icon-button"
    )}
    onClick={(event) => {
      if (event.currentTarget.querySelector("input")!.checked) onChange(group);
    }}
  >
    <GroupIcon groupName={group} />
    <input type="checkbox" name="select-group" />
  </label>
);

export default FormatControls;
