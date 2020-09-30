import React, { useState } from "react";
import YouTube from "react-youtube";
import Spinner from "./Spinner";
import Button from "./Button";
import { Alert } from "./Alert";
import "./AddYouTubeVideoForm.css";
import { VideoMeta } from "../types/cue";

const isValidVideoId = (value: string) => /^[A-Za-z0-9_-]{11}$/.test(value);

const getVideoIdFromUrl = (rawUrl: string) => {
  try {
    // Prepend protocol if required
    const url = /^https?:\/\//i.test(rawUrl)
      ? new URL(rawUrl)
      : new URL(`https://${rawUrl}`);

    if (url.searchParams.has("v")) {
      const proposedId = url.searchParams.get("v")!;
      return isValidVideoId(proposedId) ? proposedId : null;
    } else if (url.host === "youtu.be") {
      const proposedId = url.pathname.replace("/", "");
      return isValidVideoId(proposedId) ? proposedId : null;
    }
  } catch {}
  return null;
};

const YoutubeIdInput: React.FC<{
  onVideoIdChange: (videoId: string | null) => void;
}> = ({ onVideoIdChange }) => {
  const [videoUrlDraft, setVideoUrlDraft] = useState("");
  const [videoIdDraft, setVideoIdDraft] = useState("");

  return (
    <div>
      <p>
        Paste a link or video ID from YouTube. Make sure links follow one of the
        following formats
      </p>
      <ul className="youtube-id-input__examples disc-list">
        <li>
          <code>
            https://www.youtube.com/watch?v=<strong>&lt;Video ID&gt;</strong>
          </code>
        </li>
        <li>
          <code>
            https://youtu.be/<strong>&lt;Video ID&gt;</strong>
          </code>
        </li>
      </ul>
      <div className="youtube-id-input__label-row" role="group">
        <label className="youtube-id-input__label">
          From a Link
          <input
            placeholder="youtu.be/video-id"
            type="url"
            value={videoUrlDraft}
            id="add-youtube-video-form--video-url"
            onChange={(event) => {
              const value = event.currentTarget.value;
              setVideoUrlDraft(value);
              const videoId = getVideoIdFromUrl(value);
              onVideoIdChange(videoId);
            }}
          />
        </label>
        <label className="youtube-id-input__label">
          From a Video ID
          <input
            placeholder="Video ID"
            type="text"
            value={videoIdDraft}
            id="add-youtube-video-form--video-id"
            onChange={(event) => {
              const value = event.currentTarget.value;
              setVideoIdDraft(value);
              const videoId = isValidVideoId(value) ? value : null;
              onVideoIdChange(videoId);
            }}
          />
        </label>
      </div>
    </div>
  );
};

const AddYoutubeVideoForm: React.FC<{
  onSubmit: (video: VideoMeta) => void;
}> = ({ onSubmit }) => {
  const [videoId, setVideoId] = useState<null | string>(null);
  const [videoDetails, setVideoDetails] = useState<{
    title: string;
    duration: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVideoIdChange = (newVideoId: string | null) => {
    setVideoId(newVideoId);
    setVideoDetails(null);
    setErrorMessage(null);
  };
  return (
    <fieldset>
      <div className="add-youtube-video-form">
        <h3 className="add-youtube-video-form__heading xxl">YouTube</h3>

        <YoutubeIdInput onVideoIdChange={handleVideoIdChange} />

        {videoId && (
          <div>
            {errorMessage ? (
              <Alert
                type="error"
                heading={<h4>Error</h4>}
                description={errorMessage}
                actions={
                  <Button onClick={() => setErrorMessage(null)}>Retry</Button>
                }
              />
            ) : (
              <>
                {videoDetails ? (
                  <Alert
                    type="success"
                    heading={<strong>Video Loaded</strong>}
                    description={`"${videoDetails.title}" loaded successfully`}
                    actions={
                      <Button
                        onClick={() => {
                          onSubmit({
                            type: "youtube",
                            id: videoId,
                            createdAt: new Date(),
                            duration: videoDetails?.duration,
                          });
                        }}
                      >
                        Use this Video
                      </Button>
                    }
                  />
                ) : (
                  <Spinner size="lg">Loading video details</Spinner>
                )}
                <div hidden>
                  <YouTube
                    id="add-youtube-video-form"
                    videoId={videoId}
                    onReady={async ({ target }) => {
                      try {
                        const duration = (await target.getDuration()) * 1000;
                        const { title } = await target.getVideoData();
                        if (!duration || !title) {
                          setErrorMessage("No video details found");
                        } else {
                          setVideoDetails({ title, duration });
                        }
                      } catch (error) {
                        console.error("Failed to load video details", error);
                        setErrorMessage("Failed to load video details");
                      }
                    }}
                    onError={() => setErrorMessage("Failed to load video")}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default AddYoutubeVideoForm;
