import React, { useState } from "react";
import useWindowEvent from "./useWindowEvent";
import { getIsContainedBy, queryAncestor } from "../helpers/domHelpers";

const getIds = () => ({
  button: `menu-button-${Math.floor(Math.random() * 1000_000)}`,
  popup: `menu-popup-${Math.floor(Math.random() * 1000_000)}`,
});

export const useMenu = () => {
  const [ids] = useState(getIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useWindowEvent("click", (event) => {
    const isButtonClick = queryAncestor(event.target as Node, `#${ids.button}`);
    if (isButtonClick) {
      setIsMenuOpen((isOpen) => !isOpen);
    } else {
      setIsMenuOpen(false);
    }
  });
  const onBlur = (event: React.FocusEvent) => {
    if (!getIsContainedBy(event.currentTarget, event.target))
      setIsMenuOpen(false);
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    buttonProps: {
      "aria-haspopup": "menu" as "menu",
      "aria-expanded": isMenuOpen,
      "aria-controls": ids.popup,
      id: ids.button,
    },
    popupProps: {
      "aria-labelledby": ids.button,
      role: "menu" as "menu",
      id: ids.popup,
    },
    containerProps: {
      onBlur,
    },
  };
};
