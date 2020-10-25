import React from "react";
import "./ToolbarLabel.css";

const ToolbarLabel: React.FC<{
  labelText: string;
  gridArea: string;
  hasSeparators?: boolean;
  className?: string;
}> = ({ labelText, children, gridArea, className, hasSeparators = false }) => (
  <div
    className={`toolbar-label ${className} ${
      hasSeparators && "toolbar-label--has-separators"
    }`}
    style={{ gridArea }}
  >
    {children}
    <div className="toolbar-label__label sm">{labelText}</div>
  </div>
);

export default ToolbarLabel;
