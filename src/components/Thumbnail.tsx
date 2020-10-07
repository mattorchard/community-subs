import React from "react";
import AspectRatio from "./AspectRatio";
import "./Thumbnail.css";
import { VideoMeta } from "../types/cue";
import { getThumbnailUrl } from "../helpers/entityHelpers";

const Thumbnail: React.FC<{
  video?: VideoMeta;
  className?: string;
}> = ({ video, className }) => (
  <AspectRatio ratio={9 / 16} className={`thumbnail ${className}`}>
    <div
      className="thumbnail__image"
      style={{ backgroundImage: video && `url(${getThumbnailUrl(video)})` }}
    />
  </AspectRatio>
);

export default Thumbnail;
