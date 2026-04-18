import { useEffect } from "react";
import type { MutableRefObject, RefObject } from "react";

import {
  getShortcutScope,
  isTargetShortcutActive,
  isTextInputElement,
  matchesShortcut,
} from "../shortcut.utils";
import type { RegisteredContextMenuAction } from "../contextMenu.types";

interface UseContextMenuShortcutsOptions {
  actionsRef: MutableRefObject<Map<string, RegisteredContextMenuAction>>;
  targetRef: RefObject<HTMLElement | null>;
}

export function useContextMenuShortcuts({
  actionsRef,
  targetRef,
}: UseContextMenuShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      const activeElement = document.activeElement;
      const actions = Array.from(actionsRef.current.values());

      const matchingAction = actions.find((action) => {
        if (action.disabled || !action.shortcut) {
          return false;
        }

        if (!matchesShortcut(event, action.shortcut)) {
          return false;
        }

        if (
          !action.shortcut.allowInTextInput &&
          isTextInputElement(event.target)
        ) {
          return false;
        }

        const scope = getShortcutScope(action.shortcut);

        if (scope === "global") {
          return true;
        }

        return isTargetShortcutActive(targetRef, activeElement);
      });

      if (!matchingAction) {
        return;
      }

      if (matchingAction.shortcut?.preventDefault !== false) {
        event.preventDefault();
      }

      matchingAction.execute();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actionsRef, targetRef]);
}
