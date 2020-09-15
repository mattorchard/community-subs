import React, { useState } from "react";
import { ProjectVideo, saveFile } from "../repositories/ProjectRepository";
import "./AddVideoForm.css";
import { getVideoFileDetails } from "../helpers/videoHelpers";
import YouTube from "react-youtube";
import DebouncedInput from "./DebouncedInput";

const AddVideoForm: React.FC<{
  onSubmit: (video: ProjectVideo) => void;
  projectId: string;
}> = ({ onSubmit, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [youTubeVideoId, setYouTubeVideoId] = useState<string | null>(null);
  const handleYoutubeUrlChanged = (urlString: string) => {
    if (loading) {
      return;
    }
    try {
      const url = new URL(urlString);
      if (url.searchParams.has("v")) {
        const videoId = url.searchParams.get("v");
        setYouTubeVideoId(videoId);
        setLoading(true);
      } else if (url.hostname === "youtu.be") {
        const [, videoId] = url.pathname.split("/");
        setYouTubeVideoId(videoId);
        setLoading(true);
      }
    } catch (error) {}
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Pick a Video</h2>
      <label>
        Upload a video
        <input
          disabled={loading}
          type="file"
          accept="video/*"
          multiple={false}
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) {
              return;
            }
            try {
              setLoading(true);
              const details = await getVideoFileDetails(file);
              const { id: fileId } = await saveFile(projectId, file);
              onSubmit({
                type: "upload",
                ...details,
                fileId,
              });
            } finally {
              setLoading(false);
            }
          }}
        />
      </label>
      <label>
        Use a YouTube video
        <DebouncedInput
          disabled={loading}
          initialValue=""
          onValueChange={handleYoutubeUrlChanged}
          type="url"
          delayAmount={1000}
        />
      </label>
      <div>
        {youTubeVideoId && (
          <YouTube
            id="input-youtube-video"
            videoId={youTubeVideoId}
            onReady={({ target }) => {
              Promise.resolve(target.getDuration()).then((duration) => {
                onSubmit({
                  type: "youtube",
                  duration: duration * 1000,
                  aspectRatio: 1920 / 1080,
                  youtubeId: youTubeVideoId,
                  thumbnailUrl: `https://img.youtube.com/vi/${youTubeVideoId}/hqdefault.jpg`,
                });
              });
            }}
            onError={() => {
              setLoading(false);
              setYouTubeVideoId(null);
            }}
          />
        )}
      </div>
    </form>
  );
};

export default AddVideoForm;
