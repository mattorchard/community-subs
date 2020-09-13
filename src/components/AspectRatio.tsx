import React from "react";
import "./AspectRatio.css";

const AspectRatio: React.FC<{
  ratio?: number;
}> = ({ children, ratio = 1 }) => {
  return (
    <div className="aspect-ratio">
      <svg
        className="aspect-ratio__stretcher"
        viewBox={`0 0 1 ${ratio}`}
        width={1}
        height={ratio}
      />
      <div className="aspect-ratio__content">{children}</div>
    </div>
  );
};

export default AspectRatio;
