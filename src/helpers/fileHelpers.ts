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

export const readAsText = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error(`Reader failed to read`))
  reader.onload = () => resolve(reader.result as string)
  reader.readAsText(file)
});

export const getFileExtension = (fileName: string) =>
  fileName.toLowerCase().substring(fileName.lastIndexOf(".") + 1, fileName.length)