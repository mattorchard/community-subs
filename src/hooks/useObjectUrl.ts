import { useEffect, useState } from "react";

const noCleanup = () => {};

const useObjectUrl = (blob?: Blob) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      return noCleanup;
    }
    const url = URL.createObjectURL(blob);
    setUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  return url;
};

export default useObjectUrl;
