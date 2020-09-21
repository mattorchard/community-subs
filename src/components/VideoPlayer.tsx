import React, { useEffect, useMemo, useRef } from "react";
import YouTube from "react-youtube";
import { ProjectVideo } from "../repositories/ProjectRepository";
import "./VideoPlayer.css";
import FilePlayer from "./FilePlayer";
import useInterval from "../hooks/useInterval";
import useWindowSize from "../hooks/useWindowSize";

interface YtPlayer {
  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  seekTo: (timeSeconds: number) => Promise<void>;
}

const getPlayerSize = () => {
  const screenWidth = window.screen.width;
  return {
    width: (screenWidth / 2).toString(),
    height: ((screenWidth / 2) * (9 / 16)).toString(),
  };
};

type VideoPlayerProps = {
  video: ProjectVideo;
  onTimeChange: (time: number) => void;
  seekTo: number | null;
};

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  switch (props.video.type) {
    case "youtube":
      return <YouTubePlayer {...props} />;
    case "upload":
      return <UploadPlayer {...props} />;
  }
};

const YouTubePlayer: React.FC<VideoPlayerProps> = ({
  video,
  onTimeChange,
  seekTo,
}) => {
  if (video.type !== "youtube") {
    throw new Error(`Non Youtube video in youtube player`);
  }
  const playerRef = React.useRef<YtPlayer | null>(null);
  const currentTimeRef = React.useRef(0);
  const windowSize = useWindowSize();
  const playerSize = useMemo(getPlayerSize, [windowSize]);

  useEffect(() => {
    if (seekTo !== null) {
      playerRef.current?.seekTo(seekTo / 1000);
    }
  }, [seekTo]);

  useEffect(() => {
    let cancelled = false;

    const getCurrentTimeLoop = () => {
      if (playerRef.current) {
        playerRef.current.getCurrentTime().then((value) => {
          const currentTime = value * 1000;
          if (currentTimeRef.current !== currentTime) {
            currentTimeRef.current = currentTime;
            onTimeChange(currentTime);
          }
          if (!cancelled) {
            setTimeout(getCurrentTimeLoop, 40);
          }
        });
      } else if (!cancelled) {
        setTimeout(getCurrentTimeLoop);
      }
    };
    getCurrentTimeLoop();

    return () => {
      cancelled = true;
    };
  }, [onTimeChange]);

  return (
    <div className="player">
      <YouTube
        videoId={video.youtubeId}
        id="player"
        ref={(component: any) => {
          if (component?.internalPlayer)
            playerRef.current = component.internalPlayer;
        }}
        opts={playerSize}
      />
    </div>
  );
};

const UploadPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onTimeChange,
  seekTo,
}) => {
  if (video.type !== "upload")
    throw new Error(`Upload player got video of type ${video.type}`);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTimeRef = useRef(0);

  useInterval(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime * 1000;
      if (currentTimeRef.current !== currentTime) {
        currentTimeRef.current = currentTime;
        onTimeChange(currentTime);
      }
    }
  }, 40);

  useEffect(() => {
    if (seekTo !== null && videoRef.current)
      videoRef.current.currentTime = seekTo / 1000;
  }, [seekTo]);

  return (
    <div className="player">
      <FilePlayer id={video.fileId} ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
