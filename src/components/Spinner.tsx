import React from "react";
import "./Spinner.css";

type SizeProp = "sm" | "md" | "lg" | "xl";

const Spinner: React.FC<{
  size?: SizeProp;
  fadeIn?: boolean;
}> = ({ size = "md", fadeIn = false, children }) => (
  <span className={`spinner ${size} ${fadeIn && "fade-in"}`}>{children}</span>
);

export default Spinner;
