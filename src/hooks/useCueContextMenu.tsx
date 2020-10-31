import React, { useCallback, useState } from "react";
import CueContextMenu from "../components/CueContextMenu";

export type MenuDetails = {
  top: number;
  cueId: string;
} & ({ left: number } | { right: number });

const useCueContextMenu = () => {
  const [menuDetails, setMenuDetails] = useState<null | MenuDetails>(null);

  const openContextMenu = useCallback(
    (details: MenuDetails) => setMenuDetails(details),
    []
  );

  const contextMenu = menuDetails ? (
    <CueContextMenu
      {...menuDetails}
      onRequestClose={() => setMenuDetails(null)}
    />
  ) : null;
  return {
    openContextMenu,
    contextMenu,
  };
};

export default useCueContextMenu;
