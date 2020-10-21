import React from "react";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alignment } from "../types/cue";
import "./PlacementIcon.css";

type Placement = {
  justify: Alignment;
  align: Alignment;
};

const alignToTitle = {
  start: "Top",
  center: "Middle",
  end: "Bottom",
};

const justifyToTitle = {
  start: "left",
  center: "center",
  end: "right",
};

const toTitle = (placement: Placement) =>
  `${alignToTitle[placement.align]} ${justifyToTitle[placement.justify]}`;

const justifyToIcon = {
  start: faAlignLeft,
  center: faAlignCenter,
  end: faAlignRight,
};

const PlacementIcon = (placement: Placement) => (
  <FontAwesomeIcon
    icon={justifyToIcon[placement.justify]}
    title={toTitle(placement)}
    className={`placement-icon placement-icon--align-${placement.align}`}
  />
);

export default PlacementIcon;
