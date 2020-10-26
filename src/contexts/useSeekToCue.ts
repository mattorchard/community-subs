import { useSeekTo } from "./PlayerControlsContext";
import { useLiveCallback } from "../hooks/useLiveCallback";
import { useCuesContext } from "./CuesContext";

const useSeekToCue = () => {
  const seekToTime = useSeekTo();
  const { cues, cueIndexById } = useCuesContext();

  return useLiveCallback((cueId: string, edge: "start" | "end" = "start") => {
    const cue = cues[cueIndexById.get(cueId)!];
    if (cue) {
      seekToTime(cue[edge]);
    }
  });
};

export default useSeekToCue;
