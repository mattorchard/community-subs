import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FileDropTarget from "./FileDropTarget";
import { fromVtt } from "../helpers/importHelpers";
import { readAsText } from "../helpers/fileHelpers";
import { createTranscriptWithContent } from "../repositories/ProjectRepository";

const ImportTranscriptArea: React.FC<{ projectId: string }> = ({
  projectId,
}) => {
  const history = useHistory();
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handleFileImport = async (files: File[]) => {
    const [file] = files;
    if (!file) {
      return;
    }
    if (!file.name.endsWith(".vtt")) {
      setErrorMessage("File must be of type WEB VTT");
      return;
    }
    try {
      setIsLoadingImport(true);
      setErrorMessage(undefined);
      const name = file.name.replace(".vtt", "");
      const { transcript, cues } = fromVtt(await readAsText(file));
      const completeTranscript = {
        ...transcript,
        name,
        projectId,
        language: "English", // Todo: Get from VTT header
      };
      await createTranscriptWithContent(completeTranscript, cues);
      history.push(`/studio/${projectId}/${completeTranscript.id}`);
    } catch (error) {
      console.error("Failed to import file", error);
      setErrorMessage("Error, unable to import file");
    } finally {
      setIsLoadingImport(false);
    }
  };
  return (
    <FileDropTarget
      isLoading={isLoadingImport}
      errorMessage={errorMessage}
      buttonLabel="Choose a file to import"
      dropLabel="Or drag and drop one"
      onDrop={handleFileImport}
    />
  );
};

export default ImportTranscriptArea;
