const toPlainNumber = (value: number | SVGAnimatedLength) =>
  typeof value === "number" ? value : value.baseVal.value;

//type HTMLOrSVGImageElement = HTMLImageElement | SVGImageElement;
// type CanvasImageSource = HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
const getSourceSize = (source: CanvasImageSource) => {
  if (source instanceof HTMLVideoElement) {
    return { width: source.videoWidth, height: source.videoHeight };
  } else if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  } else if (source instanceof SVGElement) {
    return {
      width: toPlainNumber(source.width),
      height: toPlainNumber(source.height),
    };
  }
  return {
    width: source.width,
    height: source.height,
  };
};

const captureImage = (source: CanvasImageSource) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw Error(`Unable to create canvas context`);
  }
  const { width, height } = getSourceSize(source);
  canvas.width = width;
  canvas.height = height;
  context.drawImage(source, 0, 0);
  return { canvas, context };
};

export const captureImageBlob = async (
  source: CanvasImageSource,
  type?: string,
  quality?: any
): Promise<Blob> =>
  new Promise((resolve, reject) =>
    captureImage(source).canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to capture blob"));
        }
      },
      type,
      quality
    )
  );
