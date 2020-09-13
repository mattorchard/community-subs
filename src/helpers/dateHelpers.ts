const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};
export const toDateTimeString = (date: Date) =>
  date.toLocaleString("en-CA", options);
