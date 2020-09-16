import { useEffect, useState } from "react";

const useObjectUrl = (blob: Blob) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    setUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  return url;
};

export default useObjectUrl;
