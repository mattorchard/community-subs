import React from "react";
import YouTube from "react-youtube";
import "./VideoPlayer.css";
import useInterval from "../hooks/useInterval";

interface YTPlayer {
  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
}

const VideoPlayer: React.FC<{
  onTimeChange: (time: number) => void;
  onInit: ({ duration }: { duration: number }) => void;
}> = React.memo(({ onTimeChange, onInit }) => {
  const playerRef = React.useRef<YTPlayer | null>(null);
  const currentTimeRef = React.useRef(0);

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
  const handlePlayerReady = async () => {
    if (!playerRef.current) {
      throw new Error(`Player ready but ref is null?!`);
    }
    const durationSeconds = await playerRef.current.getDuration();
    onInit({ duration: durationSeconds * 1000 });
  };

  return (
    <div className="player">
      <YouTube
        videoId="gAkwW2tuIqE"
        id="player"
        ref={(component: any) => {
          if (component?.internalPlayer)
            playerRef.current = component.internalPlayer;
        }}
        onStateChange={({ data: playerState }) => {
          switch (playerState) {
            case YouTube.PlayerState.UNSTARTED:
              // noinspection JSIgnoredPromiseFromCall
              handlePlayerReady();
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
