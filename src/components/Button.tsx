import React from "react";
import "./Button.css";

const Button: React.FC<Partial<{
  type: "button" | "submit" | "reset";
  className: string;
}>> = ({ children, className, type = "button", ...buttonProps }) => (
  <button className={`button ${className}`} {...buttonProps}>
    {children}
  </button>
);

export default Button;
