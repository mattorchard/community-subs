import { VideoMeta } from "../types/cue";

export const getThumbnailUrl = (video: VideoMeta) => {
  switch (video.type) {
    case "upload":
      return video.thumbnailUrl;
    case "youtube":
      return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  }
}