export const padZeros = (number: number, digits = 2) =>
  (number / Math.pow(10, digits)).toFixed(digits).substr(2);

export const getLineCount = (text: string) => {
  let count = 1;
  for (const char of text) {
    if (char === "\n") count += 1;
  }
  return count;
};

export const replaceSubstring = (
  text: string,
  replacement: string,
  start: number,
  end: number
) => {
  const prefix = text.substring(0, start);
  const suffix = text.substring(end, text.length);
  return `${prefix}${replacement}${suffix}`;
};
