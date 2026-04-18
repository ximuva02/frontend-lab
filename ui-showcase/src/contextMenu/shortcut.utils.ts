import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

import type {
  ContextMenuShortcut,
  ContextMenuShortcutScope,
} from "./contextMenu.types";

function normalizeShortcutToken(value: string) {
  return value.trim().toLowerCase();
}

function normalizeKey(value: string) {
  const normalized = normalizeShortcutToken(value);

  const aliases: Record<string, string> = {
    cmd: "meta",
    command: "meta",
    control: "ctrl",
    " ": "space",
    spacebar: "space",
    escape: "esc",
    del: "delete",
    return: "enter",
    arrowup: "up",
    arrowdown: "down",
    arrowleft: "left",
    arrowright: "right",
  };

  return aliases[normalized] ?? normalized;
}

function getShortcutTokens(shortcut: ContextMenuShortcut) {
  return shortcut.keys.split("+").map(normalizeKey);
}

export function getShortcutLabel(shortcut?: ContextMenuShortcut) {
  if (!shortcut) {
    return undefined;
  }

  return shortcut.label ?? shortcut.keys;
}

export function isTextInputElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  if (target instanceof HTMLTextAreaElement) {
    return true;
  }

  if (target instanceof HTMLInputElement) {
    return [
      "text",
      "search",
      "url",
      "tel",
      "password",
      "email",
      "number",
    ].includes(target.type);
  }

  return false;
}

export function matchesShortcut(
  event: KeyboardEvent | ReactKeyboardEvent,
  shortcut: ContextMenuShortcut,
) {
  const tokens = getShortcutTokens(shortcut);
  const key = normalizeKey(event.key);
  const modifiers = {
    alt: event.altKey,
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    shift: event.shiftKey,
  };

  const requiredModifiers = {
    alt: tokens.includes("alt") || tokens.includes("option"),
    ctrl: tokens.includes("ctrl"),
    meta: tokens.includes("meta"),
    shift: tokens.includes("shift"),
  };

  if (
    modifiers.alt !== requiredModifiers.alt ||
    modifiers.ctrl !== requiredModifiers.ctrl ||
    modifiers.meta !== requiredModifiers.meta ||
    modifiers.shift !== requiredModifiers.shift
  ) {
    return false;
  }

  const nonModifierKeys = tokens.filter(
    (token) => !["alt", "option", "ctrl", "meta", "shift"].includes(token),
  );

  if (nonModifierKeys.length !== 1) {
    return false;
  }

  return nonModifierKeys[0] === key;
}

export function isTargetShortcutActive(
  targetRef: RefObject<HTMLElement | null>,
  activeElement: Element | null,
) {
  const targetElement = targetRef.current;

  if (!targetElement || !activeElement) {
    return false;
  }

  return (
    targetElement === activeElement || targetElement.contains(activeElement)
  );
}

export function getShortcutScope(
  shortcut?: ContextMenuShortcut,
): ContextMenuShortcutScope {
  return shortcut?.scope ?? "target";
}
