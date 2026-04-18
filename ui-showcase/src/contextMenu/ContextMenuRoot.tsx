import { useRef } from "react";

import { ContextMenuContext } from "./contextMenu.context";
import {
  useContextMenuFocusManagement,
  useContextMenuOpenState,
  useContextMenuPositioning,
  useContextMenuRegistry,
  useContextMenuShortcuts,
} from "./hooks";
import type { ContextMenuRootProps } from "./contextMenu.types";

export function ContextMenuRoot({ children }: ContextMenuRootProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { closeMenu, open, restoreFocusRef, setOpen } = useContextMenuOpenState();
  const {
    floatingStyles,
    openAtPoint,
    openFromTarget,
    refs,
    targetRef,
    update,
  } = useContextMenuPositioning({
    open,
    restoreFocusRef,
    setOpen,
  });
  const { actionsRef, registerAction } = useContextMenuRegistry();

  useContextMenuFocusManagement({ menuRef, open, restoreFocusRef, update });
  useContextMenuShortcuts({ actionsRef, targetRef });

  return (
    <ContextMenuContext.Provider
      value={{
        closeMenu,
        floatingStyles,
        menuRef,
        open,
        openAtPoint,
        openFromTarget,
        registerAction,
        refs,
        targetRef,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}
