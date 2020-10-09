import React from "react";
import "./FormatControls.css";
import { faBold, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupIcon from "./GroupIcon";

const FormatControls = () => {
  return (
    <div role="group" className="button-group with-dividers">
      <button className="icon-button">
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button className="icon-button">
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button className="color-button color-button--square icon-button">
        <GroupIcon groupName="square" />
      </button>
      <button className="color-button color-button--circle icon-button">
        <GroupIcon groupName="circle" />
      </button>
      <button className="color-button color-button--triangle icon-button ">
        <GroupIcon groupName="triangle" />
      </button>
    </div>
  );
};

export default FormatControls;
