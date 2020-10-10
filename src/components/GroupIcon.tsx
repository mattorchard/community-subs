import React from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faCircle, faPlay, faSquare } from "@fortawesome/free-solid-svg-icons";
import { GroupName } from "../types/Groups";
import "./GroupIcon.css";

const groupNameToIcon = {
  triangle: faPlay,
  square: faSquare,
  circle: faCircle,
};

const GroupIcon: React.FC<
  { groupName: GroupName } & Omit<FontAwesomeIconProps, "icon">
> = ({ groupName, className }) => (
  <FontAwesomeIcon
    icon={groupNameToIcon[groupName]}
    className={`group-icon--${groupName} ${className}`}
  />
);
export default GroupIcon;
