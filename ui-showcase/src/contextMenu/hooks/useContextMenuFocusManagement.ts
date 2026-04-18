import { useEffect, useLayoutEffect } from "react";
import type { MutableRefObject, RefObject } from "react";

import { getMenuItems } from "../menuItems.utils";

interface UseContextMenuFocusManagementOptions {
  menuRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  restoreFocusRef: MutableRefObject<HTMLElement | null>;
  update: () => void | Promise<void>;
}

export function useContextMenuFocusManagement({
  menuRef,
  open,
  restoreFocusRef,
  update,
}: UseContextMenuFocusManagementOptions) {
  useEffect(() => {
    if (open) {
      return;
    }

    restoreFocusRef.current?.focus();
    restoreFocusRef.current = null;
  }, [open, restoreFocusRef]);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    void update();
    const firstItem = getMenuItems(menuRef.current)[0];
    firstItem?.focus();

    return undefined;
  }, [menuRef, open, update]);
}
