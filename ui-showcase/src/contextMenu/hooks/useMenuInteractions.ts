import { useEffect } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

interface UseMenuInteractionsOptions {
  closeMenu: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
  open: boolean;
}

function focusItemAtIndex(
  menuRef: RefObject<HTMLDivElement | null>,
  index: number,
) {
  const items = getMenuItems(menuRef.current);

  if (items.length === 0) {
    return;
  }

  const normalizedIndex = (index + items.length) % items.length;
  items[normalizedIndex]?.focus();
}

const MENU_ITEM_SELECTOR = '[data-context-menu-item="true"]:not(:disabled)';

function getMenuItems(menuElement: HTMLElement | null) {
  if (!menuElement) {
    return [];
  }

  return Array.from(
    menuElement.querySelectorAll<HTMLButtonElement>(MENU_ITEM_SELECTOR),
  );
}

export function useMenuInteractions({
  closeMenu,
  menuRef,
  open,
}: UseMenuInteractionsOptions) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const menuElement = menuRef.current;

      if (!menuElement) {
        return;
      }

      if (!menuElement.contains(event.target as Node)) {
        closeMenu();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeMenu, menuRef, open]);

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = getMenuItems(menuRef.current);
    const currentIndex = items.findIndex(
      (item) => item === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        focusItemAtIndex(menuRef, currentIndex < 0 ? 0 : currentIndex + 1);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        focusItemAtIndex(
          menuRef,
          currentIndex < 0 ? items.length - 1 : currentIndex - 1,
        );
        return;
      }
      case "Home": {
        event.preventDefault();
        focusItemAtIndex(menuRef, 0);
        return;
      }
      case "End": {
        event.preventDefault();
        focusItemAtIndex(menuRef, items.length - 1);
        return;
      }
      case "Escape": {
        event.preventDefault();
        closeMenu();
        return;
      }
      case "Tab": {
        closeMenu();
        return;
      }
      default:
        return;
    }
  }

  return {
    handleMenuKeyDown,
  };
}
