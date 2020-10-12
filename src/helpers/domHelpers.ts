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

export const getOffsetLeft = (node: Node) =>
  node instanceof HTMLElement
    ? node.offsetLeft
    : node.parentElement?.offsetLeft || 0;

export const matchScrollHeight = (element: HTMLElement) => {
  element.style.height = "0"; // Must be set to 0 first, otherwise will never shrink
  element.style.height = `${element.scrollHeight}px`;
};

export const getClassName = (
  baseName: string,
  modifiers: { [key: string]: any },
  others?: string
) => {
  const classes = [baseName, others];
  Object.entries(modifiers).forEach(([key, value]) => {
    if (value) {
      classes.push(`${baseName}--${key}`);
    }
  });
  return classes.join(" ");
};

export const getModifierKeys = (event: KeyboardEvent | PointerEvent) => ({
  alt: event.altKey,
  ctrl: event.ctrlKey,
  meta: event.metaKey,
  shift: event.shiftKey,
});
export type ModifierKeys = ReturnType<typeof getModifierKeys>;
