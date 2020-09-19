import React from "react";
import AspectRatio from "./AspectRatio";
import "./Thumbnail.css";

const Thumbnail: React.FC<{
  url?: string;
  className?: string;
}> = ({ url, className }) => (
  <AspectRatio ratio={9 / 16} className={`thumbnail ${className}`}>
    <div
      className="thumbnail__image"
      style={{ backgroundImage: `url(${url})` }}
    />
  </AspectRatio>
);

export default Thumbnail;
