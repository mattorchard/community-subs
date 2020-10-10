import React from "react";
import "./FormatControls.css";
import { faBold, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupIcon from "./GroupIcon";
import { useToolsContext } from "../contexts/ToolsContext";
import { GroupName } from "../types/Groups";
import { getClassName } from "../helpers/domHelpers";
import { useCueSelection } from "../contexts/CueSelectionContext";
import { useCuesContext } from "../contexts/CuesContext";

const FormatControls = () => {
  const { selectedGroup, setSelectedGroup } = useToolsContext();
  const cueSelection = useCueSelection();
  const { updateCues } = useCuesContext();

  const handleChange = (group: GroupName) => {
    setSelectedGroup(group);
    updateCues([...cueSelection].map((id) => ({ id, group })));
  };
  return (
    <div role="group" className="button-group with-dividers">
      <button className="icon-button">
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button className="icon-button">
        <FontAwesomeIcon icon={faItalic} />
      </button>

      <SelectGroupButton
        group="square"
        selectedGroup={selectedGroup}
        onChange={handleChange}
      />
      <SelectGroupButton
        group="circle"
        selectedGroup={selectedGroup}
        onChange={handleChange}
      />
      <SelectGroupButton
        group="triangle"
        selectedGroup={selectedGroup}
        onChange={handleChange}
      />
    </div>
  );
};

const SelectGroupButton: React.FC<{
  group: GroupName;
  selectedGroup: GroupName;
  onChange: (group: GroupName) => void;
}> = ({ group, selectedGroup, onChange }) => (
  <label
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
