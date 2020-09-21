import React, { useEffect, useMemo } from "react";
import YouTube from "react-youtube";
import { ProjectVideo } from "../repositories/ProjectRepository";
import "./VideoPlayer.css";

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
    default:
      // Todo: Proper error formatting
      return <p>Unsupported player type {props.video.type}</p>;
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
  const playerSize = useMemo(getPlayerSize, []);

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
        onStateChange={({ data: playerState }) => {
          switch (playerState) {
            case YouTube.PlayerState.UNSTARTED:
              break;
            case YouTube.PlayerState.ENDED:
              console.debug("Player Ended");
              break;
            case YouTube.PlayerState.PLAYING:
              console.debug("Player playing");
              break;
            case YouTube.PlayerState.PAUSED:
              console.debug("Player Paused");
              break;
            case YouTube.PlayerState.BUFFERING:
              console.debug("Player Buffering");
              break;
          }
        }}
      />
    </div>
  );
};

export default VideoPlayer;
