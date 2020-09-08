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
