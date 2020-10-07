import React, { useRef } from "react";
import { useOnModifierKeysChange } from "../contexts/ModifierKeysContext";
import { getClassName } from "../helpers/domHelpers";

const ModifierKeysStyler: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null!);
  useOnModifierKeysChange((keys) =>
    ref.current.setAttribute("class", getClassName("modifier-key", keys))
  );
  return <div ref={ref}>{children}</div>;
};

export default ModifierKeysStyler;
