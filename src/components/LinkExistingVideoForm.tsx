import React from "react";
import { VideoMeta } from "../types/cue";
import useVideos from "../hooks/useVideos";
import Thumbnail from "./Thumbnail";
import { getThumbnailUrl } from "../helpers/entityHelpers";
import "./LinkExistingVideoForm.css";
import Spinner from "./Spinner";

const LinkExistingVideoForm: React.FC<{
  onSubmit: (video: VideoMeta) => void;
}> = ({ onSubmit }) => {
  const videos = useVideos();
  if (!videos) {
    return <Spinner fadeIn>Loading Videos</Spinner>;
  }
  if (videos.length === 0) {
    // User hasn't uploaded any videos yet
    return null;
  }
  return (
    <div className="link-existing-video-form">
      <h3 className="xxl">Reuse a Video</h3>

      <ol className="existing-video-list">
        {videos.map((video) => (
          <li key={video.id}>
            <button
              className="existing-video-list__item__button focus-outline"
              title={video.name}
              onClick={() => onSubmit(video)}
            >
              <Thumbnail url={getThumbnailUrl(video)} />
              <div className="existing-video-list__item__name lg ellipses">
                {video.name}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LinkExistingVideoForm;
