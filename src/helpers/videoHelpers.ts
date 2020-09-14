import { HOUR } from "./timingHelpers";

const waitForDuration = (mediaElement: HTMLMediaElement, timeout: number) =>
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
      mediaElement.removeEventListener("durationchange", loadedHandler);
      mediaElement.removeEventListener("error", errorHandler);
    };
    mediaElement.addEventListener("durationchange", loadedHandler);
    mediaElement.addEventListener("error", errorHandler);

    setTimeout(() => {
      unsubscribe();
      reject(new Error(`Timed out waiting for metadata`));
    }, timeout);
  });

export const getVideoFileDetails = async (
  file: File
): Promise<{ duration: number; aspectRatio: number }> => {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    const loadedPromise = waitForDuration(video, 10000);

    video.setAttribute("preload", "metadata");
    video.setAttribute("hidden", "true");
    video.setAttribute("src", url);

    // Duration won't load until video is completed
    video.currentTime = (99 * HOUR) / 1000; // Measured in seconds

    await loadedPromise;

    const duration = video.duration * 1000; // Default is in seconds
    const aspectRatio = video.videoWidth / video.videoHeight;

    return { duration, aspectRatio };
  } finally {
    URL.revokeObjectURL(url);
  }
};
