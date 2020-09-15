import { HOUR } from "./timingHelpers";
import { captureImageToDataUrl } from "./imageHelpers";

const waitForMediaEvent = (
  mediaElement: HTMLMediaElement,
  eventName: string,
  timeout: number
) =>
  new Promise((resolve, reject) => {
    if (!isNaN(mediaElement.duration)) {
      return resolve(mediaElement);
    }
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

export const getVideoFileDetails = async (file: File) => {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    const loadedPromise = waitForMediaEvent(video, "durationchange", 10000);

    video.setAttribute("preload", "metadata");
    video.setAttribute("hidden", "true");
    video.setAttribute("src", url);

    // Duration won't load until video is completed
    video.currentTime = (99 * HOUR) / 1000; // Measured in seconds

    await loadedPromise;

    const duration = video.duration * 1000; // Default is in seconds
    const aspectRatio = video.videoWidth / video.videoHeight;

    const seekedPromise = waitForMediaEvent(video, "seeked", 1000);
    video.currentTime = duration / 2;
    await seekedPromise;
    const thumbnailUrl = await captureImageToDataUrl(
      video,
      "image/jpeg",
      "0.85"
    );

    return { duration, aspectRatio, thumbnailUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
};
