import { HOUR } from "./timingHelpers";
import { captureImageToDataUrl } from "./imageHelpers";

const waitForMediaEvent = (
  mediaElement: HTMLMediaElement,
  eventName: string,
  timeout: number
) =>
  new Promise((resolve, reject) => {
    const loadedHandler = () => {
      if (mediaElement.duration !== Infinity) {
        unsubscribe();
        resolve(mediaElement);
      }
    };
    const errorHandler = () => {
      unsubscribe();
      reject(new Error(`Failed to load`));
    };
    const unsubscribe = () => {
      mediaElement.removeEventListener(eventName, loadedHandler);
      mediaElement.removeEventListener("error", errorHandler);
    };
    mediaElement.addEventListener(eventName, loadedHandler);
    mediaElement.addEventListener("error", errorHandler);

    setTimeout(() => {
      unsubscribe();
      reject(new Error(`Timed out waiting for metadata`));
    }, timeout);
  });

const getVideoDuration = async (video: HTMLVideoElement) => {
  if (!video.duration || video.duration === Infinity) {
    const durationLoadedPromise = waitForMediaEvent(
      video,
      "durationchange",
      10000
    );
    // Duration won't load until video is completed
    video.currentTime = (99 * HOUR) / 1000; // Measured in seconds
    await durationLoadedPromise;
  }

  // Raw is in seconds
  return video.duration * 1000;
};

const getVideoThumbnail = async (
  video: HTMLVideoElement,
  whenToCapture: number
) => {
  const seekedPromise = waitForMediaEvent(video, "seeked", 3000);
  video.currentTime = whenToCapture;
  await seekedPromise;
  return captureImageToDataUrl(video, "image/jpeg", "0.85");
};

export const getVideoFileDetails = async (file: File) => {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.setAttribute("preload", "metadata");
    video.setAttribute("src", url);

    const duration = await getVideoDuration(video);

    const thumbnailUrl = await getVideoThumbnail(video, duration / 2);

    return { duration, thumbnailUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
};

const videoTypes = ["webm", "mp4", "h264", "vp9", "hls", "ogg"];
export const getSupportedVideoTypes = (optimistic = true) => {
  const video = document.createElement("video");
  return videoTypes.filter((type) => {
    const canPlay = video.canPlayType(`video/${type}`);
    if (canPlay === "probably") {
      return true;
    } else if (optimistic && canPlay === "maybe") {
      return true;
    }
    return false;
  });
};
