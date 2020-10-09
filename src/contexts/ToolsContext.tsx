import React, { useState } from "react";
import { defaultGroup, GroupName } from "../types/Groups";

const ToolsContext = React.createContext<null>(null);

export const ToolsContextProvider: React.FC = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupName>(defaultGroup);
  return <ToolsContext.Provider value={null}>{children}</ToolsContext.Provider>;
};
