import React, { useContext, useState } from "react";
import { defaultGroup, GroupName } from "../types/Groups";

type ToolsContextType = {
  selectedGroup: GroupName;
  setSelectedGroup: (group: GroupName) => void;
};

const ToolsContext = React.createContext<ToolsContextType | null>(null);

export const ToolsContextProvider: React.FC = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupName>(defaultGroup);
  return (
    <ToolsContext.Provider value={{ selectedGroup, setSelectedGroup }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useToolsContext = () => {
  const context = useContext(ToolsContext);
  if (!context) throw new Error("Cannot use ToolsContext outside of provider");
  return context;
};
