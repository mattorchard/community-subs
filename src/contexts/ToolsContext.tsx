import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { defaultGroup, GroupName } from "../types/Groups";

type ToolsContextType = {
  selectedGroup: GroupName;
  setSelectedGroup: Dispatch<SetStateAction<GroupName>>;
  isSnapToOthersEnabled: boolean;
  setIsSnapToOthersEnabled: Dispatch<SetStateAction<boolean>>;
  isSnapToGridEnabled: boolean;
  setIsSnapToGridEnabled: Dispatch<SetStateAction<boolean>>;
};

const ToolsContext = React.createContext<ToolsContextType | null>(null);

export const ToolsContextProvider: React.FC = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupName>(defaultGroup);
  const [isSnapToOthersEnabled, setIsSnapToOthersEnabled] = useState(false);
  const [isSnapToGridEnabled, setIsSnapToGridEnabled] = useState(false);

  return (
    <ToolsContext.Provider
      value={{
        selectedGroup,
        setSelectedGroup,
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

export const useToolsContext = () => {
  const context = useContext(ToolsContext);
  if (!context) throw new Error("Cannot use ToolsContext outside of provider");
  return context;
};
