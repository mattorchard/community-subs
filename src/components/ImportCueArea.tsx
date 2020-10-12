import React, { useState } from "react";
import FileDropTarget from "./FileDropTarget";
import { fromVtt } from "../helpers/importHelpers";
import { readAsText } from "../helpers/fileHelpers";
import { useCuesContext } from "../contexts/CuesContext";

const ImportCueArea: React.FC<{ transcriptId: string }> = ({
  transcriptId,
}) => {
  const { createCuesBulk } = useCuesContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  return (
    <FileDropTarget
      className="import-cue-area"
      buttonLabel="Choose a transcript to import"
      dropLabel="Or drag an drop one"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onDrop={async (files) => {
        const [file] = files;
        if (!file) {
          return;
        }
        setErrorMessage("");
        try {
          setIsLoading(true);
          const cues = fromVtt(transcriptId, await readAsText(file));
          await createCuesBulk(cues);
        } catch (error) {
          // Todo: Toast
          console.error("Failed to load file", error);
          setErrorMessage("Error loading file");
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
};

export default ImportCueArea;
