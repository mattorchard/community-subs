import { useTranscripts } from "../contexts/TranscriptContext";
import { useMemo } from "react";
import { dedupe } from "../helpers/algoHelpers";
import { VideoMeta } from "../types/cue";

const videoComparator = (videoA: VideoMeta, videoB: VideoMeta) =>
  videoB.createdAt.getTime() - videoA.createdAt.getTime();

const useVideos = () => {
  const transcripts = useTranscripts();
  return useMemo(() => {
    if (!transcripts) {
      return null;
    }
    const videos = dedupe(
      transcripts
        .map((transcript) => transcript.video)
        .filter(Boolean) as VideoMeta[],
      "id"
    );
    videos.sort(videoComparator);

    return videos;
  }, [transcripts]);
};

export default useVideos;
