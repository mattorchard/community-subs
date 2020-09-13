import React from "react";
import "./AspectRatio.css";
import { getClassName } from "../helpers/domHelpers";

const AspectRatio: React.FC<{
  as?: keyof JSX.IntrinsicElements;
  ratio?: number;
  center?: boolean;
}> = ({ children, as = "div", ratio = 1, center = false }) => {
  const TagName = as;
  return (
    <TagName className="aspect-ratio">
      <svg
        className="aspect-ratio__stretcher"
        viewBox={`0 0 1 ${ratio}`}
        width={1}
        height={ratio}
      />
      <div className={getClassName("aspect-ratio__content", { center })}>
        {children}
      </div>
    </TagName>
  );
};

export default AspectRatio;
