import React, { Dispatch, SetStateAction, useState } from "react";
import useContextSafe from "../hooks/useContextSafe";

type ToolsContextType = {
  isSnapToOthersEnabled: boolean;
  setIsSnapToOthersEnabled: Dispatch<SetStateAction<boolean>>;
  isSnapToGridEnabled: boolean;
  setIsSnapToGridEnabled: Dispatch<SetStateAction<boolean>>;
};

const ToolsContext = React.createContext<ToolsContextType | null>(null);
ToolsContext.displayName = "ToolsContext";

export const ToolsContextProvider: React.FC = ({ children }) => {
  const [isSnapToOthersEnabled, setIsSnapToOthersEnabled] = useState(false);
  const [isSnapToGridEnabled, setIsSnapToGridEnabled] = useState(false);

  return (
    <ToolsContext.Provider
      value={{
        isSnapToOthersEnabled,
        setIsSnapToOthersEnabled,
        isSnapToGridEnabled,
        setIsSnapToGridEnabled,
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useToolsContext = () => useContextSafe(ToolsContext);
