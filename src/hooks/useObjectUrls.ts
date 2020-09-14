import { useEffect, useState } from "react";

const useObjectUrls = (blobs: (Blob | undefined)[]) => {
  const [objectUrls, setObjectUrls] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    const urls = blobs.map((blob) => blob && URL.createObjectURL(blob));
    setObjectUrls(urls);
    return () => urls.forEach((url) => url && URL.revokeObjectURL(url));
  }, [blobs]);

  return objectUrls;
};

export default useObjectUrls;
