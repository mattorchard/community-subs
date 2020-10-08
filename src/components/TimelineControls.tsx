import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnet } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import React from "react";

const TimelineControls = () => (
  <div>
    <Button>
      <FontAwesomeIcon icon={faMagnet} />
    </Button>
  </div>
);

export default TimelineControls;
