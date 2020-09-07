export const padZeros = (number: number, digits = 2) =>
  (number / Math.pow(10, digits)).toFixed(digits).substr(2);
