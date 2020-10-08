export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

export const debounce = <T extends Array<any>, R>(
  callback: (...args: T) => R,
  delayAmount: number
) => {
  let timeoutId: number | null = null;
  return {
    debounced: (...args: T) => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, delayAmount);
    },
    immediate: (...args: T) => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      callback(...args);
    },
  };
};

export const throttle = <T extends Array<any>, R>(
  callback: (...args: T) => R,
  windowAmount: number
) => {
  let allowedAfter = 0;
  return (...args: T) => {
    if (Date.now() > allowedAfter) {
      allowedAfter = Date.now() + windowAmount;
      return callback(...args);
    }
  };
};
