export const getIsStorageVolatile = () => {
  // Todo: Use feature detection instead of UA sniffing
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("safari") && !userAgent.includes("chrome");
};
