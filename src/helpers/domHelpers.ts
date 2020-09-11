export const queryAncestor = (node: Node, selector: string) => {
  let ancestor: any;
  if (node instanceof Element) {
    ancestor = node.closest(selector);
  } else if (node.parentElement) {
    ancestor = node.parentElement?.closest(selector);
  }
  if (ancestor instanceof HTMLElement) {
    return ancestor;
  }
  return null;
};

export const matchScrollHeight = (element: HTMLElement) => {
  element.style.height = "0"; // Must be set to 0 first, otherwise will never shrink
  element.style.height = `${element.scrollHeight}px`;
};
