import React, { useMemo } from "react";
import YouTube from "react-youtube";
import "./VideoPlayer.css";
import useInterval from "../hooks/useInterval";
import { ProjectVideo } from "../repositories/ProjectRepository";

interface YTPlayer {
  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
}

const getPlayerSize = () => {
  const screenWidth = window.screen.width;
  return {
    width: (screenWidth / 2).toString(),
    height: ((screenWidth / 2) * (9 / 16)).toString(),
  };
};

const VideoPlayer: React.FC<{
  video: ProjectVideo;
  onTimeChange: (time: number) => void;
}> = React.memo(({ onTimeChange, video }) => {
  const playerRef = React.useRef<YTPlayer | null>(null);
  const currentTimeRef = React.useRef(0);
  const playerSize = useMemo(getPlayerSize, []);

  // Todo: re-work to ensure never more than one request at a time
  useInterval(() => {
    if (playerRef.current)
      Promise.resolve(playerRef.current.getCurrentTime()).then((value) => {
        const currentTime = value * 1000;
        if (currentTimeRef.current !== currentTime) {
          currentTimeRef.current = currentTime;
          onTimeChange(currentTime);
        }
      });
  }, 50);

  if (video.type === "upload") {
    return (
      <div className="player">
        <p>Manual upload not yet supported</p>
      </div>
    );
  }

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
});

export default VideoPlayer;
