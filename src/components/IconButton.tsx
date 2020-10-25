import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const IconButton: React.FC<
  {
    title: string;
    icon: IconDefinition;
  } & ButtonProps
> = ({ title, icon, className, ...buttonProps }) => (
  <button {...buttonProps} title={title} className={`icon-button ${className}`}>
    <FontAwesomeIcon icon={icon} />
  </button>
);
export default IconButton;
