import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseMenuFocusRestoreOptions {
  open: boolean;
  focusMenuItem: (index: number) => void;
  menuRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLDivElement | null>;
  update?: () => void | Promise<void>;
}

export function useMenuFocusRestore({
  open,
  focusMenuItem,
  menuRef,
  triggerRef,
  update,
}: UseMenuFocusRestoreOptions) {
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open || !menuRef.current) {
      if (!open && wasOpenRef.current) {
        triggerRef.current?.focus();
      }

      wasOpenRef.current = open;
      return undefined;
    }

    focusMenuItem(0);
    wasOpenRef.current = open;

    void update?.();

    return undefined;
  }, [focusMenuItem, open, update]);
}
