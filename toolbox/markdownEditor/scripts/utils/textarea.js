export function normalizeTextareaHeight(target) {
  const element = target;

  if (!element) {
    return;
  }

  element.style.height = "0px";
  element.style.height = `${Math.max(element.scrollHeight, 32)}px`;
}
