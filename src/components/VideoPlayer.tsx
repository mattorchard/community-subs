import React, { useEffect, useMemo, useRef } from "react";
import YouTube from "react-youtube";
import { VideoMeta } from "../types/cue";
import "./VideoPlayer.css";
import FilePlayer from "./FilePlayer";
import useInterval from "../hooks/useInterval";
import useWindowSize from "../hooks/useWindowSize";
import {
  useIsPlayingState,
  useOnSeekTo,
  usePlayerTimePublisher,
} from "../contexts/PlayerControlsContext";

interface YtPlayer {
  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  seekTo: (timeSeconds: number) => Promise<void>;
  setSize: (width: number, height: number) => void;
  playVideo: () => Promise<void>;
  pauseVideo: () => Promise<void>;
}

const getPlayerSize = (windowWidth: number) => {
  return {
    width: windowWidth / 2,
    height: (windowWidth / 2) * (9 / 16),
  };
};

type VideoPlayerProps = {
  video: VideoMeta;
};

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  switch (props.video.type) {
    case "youtube":
      return <YouTubePlayer {...props} />;
    case "upload":
      return <UploadPlayer {...props} />;
  }
};

const YouTubePlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  if (video.type !== "youtube")
    throw new Error(`Non Youtube video in youtube player`);

  const playerRef = React.useRef<YtPlayer | null>(null);
  const currentTimeRef = React.useRef(0);
  const windowSize = useWindowSize();
  const [isPlaying, setIsPlaying] = useIsPlayingState();

  // Any change to this results in the Youtube player unloading the video
  const playerOptions = useMemo(() => {
    const { width, height } = getPlayerSize(window.innerWidth);
    return {
      width: width.toString(),
      height: height.toString(),
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      const { width, height } = getPlayerSize(windowSize.width);
      playerRef.current.setSize(width, height);
    }
  }, [windowSize]);

  const onTimeChange = usePlayerTimePublisher();
  useOnSeekTo((time) => playerRef.current?.seekTo(time / 1000));

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

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return (
    <div className="player">
      <YouTube
        videoId={video.id}
        id="player"
        ref={(component: any) => {
          if (component?.internalPlayer)
            playerRef.current = component.internalPlayer;
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        opts={playerOptions}
      />
    </div>
  );
};

const UploadPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  if (video.type !== "upload")
    throw new Error(`Upload player got video of type ${video.type}`);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useIsPlayingState();

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useOnSeekTo((time) => {
    if (videoRef.current) videoRef.current.currentTime = time / 1000;
  });
  const onTimeChange = usePlayerTimePublisher();

  useInterval(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime * 1000;
      if (currentTimeRef.current !== currentTime) {
        currentTimeRef.current = currentTime;
        onTimeChange(currentTime);
      }
    }
  }, 40);

  return (
    <div className="player">
      <FilePlayer
        id={video.id}
        ref={videoRef}
        onIsPlayingChange={setIsPlaying}
      />
    </div>
  );
};

export default VideoPlayer;
