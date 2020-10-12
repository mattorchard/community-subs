import React from "react";
import "./Button.css";
import { getClassName } from "../helpers/domHelpers";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<Partial<
  {
    type: "button" | "submit" | "reset";
    leftIcon?: boolean;
    rightIcon?: boolean;
    className: string;
  } & ButtonProps
>> = ({
  children,
  className,
  type = "button",
  leftIcon,
  rightIcon,
  ...buttonProps
}) => (
  <button
    className={getClassName(
      "button",
      { "left-icon": leftIcon, "right-icon": rightIcon },
      className
    )}
    {...buttonProps}
  >
    {children}
  </button>
);

export default Button;
