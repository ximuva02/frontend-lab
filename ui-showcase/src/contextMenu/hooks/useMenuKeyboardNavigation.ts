import { useCallback } from "react";
import type { RefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

interface UseMenuKeyboardNavigationOptions {
  menuRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  handleClose: () => void;
  openAtPosition: (nextX: number, nextY: number) => void;
}

export function useMenuKeyboardNavigation({
  menuRef,
  triggerRef,
  open,
  handleClose,
  openAtPosition,
}: UseMenuKeyboardNavigationOptions) {
  const isMenuFocused = useCallback(() => {
    const menuElement = menuRef.current;
    const activeElement = document.activeElement;

    return Boolean(
      open &&
      menuElement &&
      activeElement &&
      menuElement.contains(activeElement),
    );
  }, [menuRef, open]);

  const getMenuItems = useCallback(() => {
    return menuRef.current?.querySelectorAll<HTMLButtonElement>(
      MENU_ITEM_SELECTOR,
    );
  }, [menuRef]);

  const focusMenuItem = useCallback(
    (index: number) => {
      const items = getMenuItems();
      if (!items || items.length === 0) {
        return;
      }

      const normalizedIndex = (index + items.length) % items.length;
      items[normalizedIndex]?.focus();
    },
    [getMenuItems],
  );

  const getCurrentIndex = useCallback(() => {
    const items = getMenuItems();
    if (!items || items.length === 0) {
      return { currentIndex: -1, total: 0 };
    }

    return {
      currentIndex: Array.from(items).findIndex(
        (item) => item === document.activeElement,
      ),
      total: items.length,
    };
  }, [getMenuItems]);

  useHotkeys(
    ["shift+f10", "contextmenu", "enter", "space"],
    (event) => {
      const triggerElement = triggerRef.current;
      if (!triggerElement || document.activeElement !== triggerElement) {
        return;
      }

      event.preventDefault();

      const rect = triggerElement.getBoundingClientRect();
      openAtPosition(rect.left + 8, rect.top + rect.height / 2);
    },
    {
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: true,
    },
    [openAtPosition, triggerRef],
  );

  useHotkeys(
    "down",
    (event) => {
      if (!isMenuFocused()) {
        return;
      }

      const { currentIndex } = getCurrentIndex();
      event.preventDefault();
      focusMenuItem(currentIndex < 0 ? 0 : currentIndex + 1);
    },
    {
      enabled: open,
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: true,
    },
    [focusMenuItem, getCurrentIndex, isMenuFocused, open],
  );

  useHotkeys(
    "up",
    (event) => {
      if (!isMenuFocused()) {
        return;
      }

      const { currentIndex, total } = getCurrentIndex();
      event.preventDefault();
      focusMenuItem(currentIndex < 0 ? total - 1 : currentIndex - 1);
    },
    {
      enabled: open,
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: true,
    },
    [focusMenuItem, getCurrentIndex, isMenuFocused, open],
  );

  useHotkeys(
    "home",
    (event) => {
      if (!isMenuFocused()) {
        return;
      }

      event.preventDefault();
      focusMenuItem(0);
    },
    {
      enabled: open,
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: true,
    },
    [focusMenuItem, isMenuFocused, open],
  );

  useHotkeys(
    "end",
    (event) => {
      if (!isMenuFocused()) {
        return;
      }

      const { total } = getCurrentIndex();
      event.preventDefault();
      focusMenuItem(total - 1);
    },
    {
      enabled: open,
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: true,
    },
    [focusMenuItem, getCurrentIndex, isMenuFocused, open],
  );

  useHotkeys(
    "esc",
    (event) => {
      if (!isMenuFocused()) {
        return;
      }

      event.preventDefault();
      handleClose();
    },
    {
      enabled: open,
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: true,
    },
    [handleClose, isMenuFocused, open],
  );

  useHotkeys(
    "tab",
    () => {
      if (!isMenuFocused()) {
        return;
      }

      handleClose();
    },
    {
      enabled: open,
      enableOnFormTags: false,
      keydown: true,
      keyup: false,
      preventDefault: false,
    },
    [handleClose, isMenuFocused, open],
  );

  return {
    focusMenuItem,
  };
}
