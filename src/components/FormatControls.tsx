import React from "react";
import "./FormatControls.css";
import { faBold, faItalic, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormatControls = () => (
  <div role="group" className="button-group with-dividers">
    <button className="icon-button">
      <FontAwesomeIcon icon={faBold} />
    </button>
    <button className="icon-button">
      <FontAwesomeIcon icon={faItalic} />
    </button>
    <button className="icon-button">
      <FontAwesomeIcon icon={faPalette} />
    </button>
  </div>
);

export default FormatControls;
