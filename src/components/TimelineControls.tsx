import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnet, faRulerCombined } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const TimelineControls = () => (
  <div
    role="group"
    className="button-group with-dividers"
    style={{ gridArea: "timeline" }}
  >
    <button className="icon-button">
      <FontAwesomeIcon icon={faMagnet} />
    </button>
    <button className="icon-button">
      <FontAwesomeIcon icon={faRulerCombined} />
    </button>
  </div>
);

export default TimelineControls;
