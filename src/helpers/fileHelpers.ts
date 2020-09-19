export const downloadFile = (fileName: string, blob: Blob) => {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  try {
    a.setAttribute("download", fileName);
    a.setAttribute("href", url);
    a.setAttribute("hidden", "true");
    document.body.appendChild(a);
    a.click();
  } finally {
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 66);
  }
};

export const createVttBlob = (text: string) =>
  new Blob([text], { type: "text/vtt" });
