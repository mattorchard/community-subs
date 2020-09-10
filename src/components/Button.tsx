import React from "react";
import "./Button.css";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<Partial<
  {
    type: "button" | "submit" | "reset";
    className: string;
  } & ButtonProps
>> = ({ children, className, type = "button", ...buttonProps }) => (
  <button className={`button ${className}`} {...buttonProps}>
    {children}
  </button>
);

export default Button;
