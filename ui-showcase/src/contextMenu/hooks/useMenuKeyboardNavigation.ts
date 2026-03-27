import { useCallback } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

interface UseMenuKeyboardNavigationOptions {
  menuRef: RefObject<HTMLDivElement | null>;
  handleClose: () => void;
  openAtPosition: (nextX: number, nextY: number) => void;
}

export function useMenuKeyboardNavigation({
  menuRef,
  handleClose,
  openAtPosition,
}: UseMenuKeyboardNavigationOptions) {
  const focusMenuItem = useCallback(
    (index: number) => {
      const items =
        menuRef.current?.querySelectorAll<HTMLButtonElement>(
          MENU_ITEM_SELECTOR,
        );
      if (!items || items.length === 0) {
        return;
      }

      const normalizedIndex = (index + items.length) % items.length;
      items[normalizedIndex]?.focus();
    },
    [menuRef],
  );

  const handleTriggerKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const isContextMenuKey = event.key === "ContextMenu";
      const isShiftF10 = event.key === "F10" && event.shiftKey;
      const isActionKey = event.key === "Enter" || event.key === " ";

      if (!isContextMenuKey && !isShiftF10 && !isActionKey) {
        return;
      }

      event.preventDefault();

      const rect = event.currentTarget.getBoundingClientRect();
      openAtPosition(rect.left + 8, rect.top + rect.height / 2);
    },
    [openAtPosition],
  );

  const handleMenuKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const items =
        menuRef.current?.querySelectorAll<HTMLButtonElement>(
          MENU_ITEM_SELECTOR,
        );
      if (!items || items.length === 0) {
        if (event.key === "Escape" || event.key === "Tab") {
          handleClose();
        }
        return;
      }

      const currentIndex = Array.from(items).findIndex(
        (item) => item === document.activeElement,
      );

      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key === "Tab") {
        handleClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusMenuItem(currentIndex < 0 ? 0 : currentIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusMenuItem(currentIndex < 0 ? items.length - 1 : currentIndex - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusMenuItem(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusMenuItem(items.length - 1);
      }
    },
    [focusMenuItem, handleClose, menuRef],
  );

  return {
    focusMenuItem,
    handleMenuKeyDown,
    handleTriggerKeyDown,
  };
}
