import { useEffect } from "react";

import { mergeClassNames } from "../shared/utils/mergeClassNames";
import { useContextMenuContext } from "./contextMenu.context";
import styles from "./contextMenu.module.css";
import type { ContextMenuItemProps } from "./contextMenu.types";
import { getShortcutLabel } from "./shortcut.utils";

export function ContextMenuItem({
  children,
  className,
  disabled = false,
  id,
  onAction,
  shortcut,
}: ContextMenuItemProps) {
  const { closeMenu, open, registerAction } = useContextMenuContext();

  function dispatchAction(source: "menu" | "shortcut") {
    if (disabled) {
      return;
    }

    onAction?.({ id, source });
    closeMenu();
  }

  useEffect(() => {
    return registerAction({
      disabled,
      execute: () => {
        if (disabled) {
          return;
        }

        onAction?.({ id, source: "shortcut" });
        closeMenu();
      },
      id,
      shortcut,
    });
  }, [closeMenu, disabled, id, onAction, registerAction, shortcut]);

  return (
    <button
      type="button"
      role="menuitem"
      data-context-menu-item="true"
      className={mergeClassNames(styles.item, className)}
      disabled={disabled}
      onClick={() => dispatchAction("menu")}
      tabIndex={open ? -1 : undefined}
    >
      <span className={styles.itemLabel}>{children}</span>
      <span aria-hidden="true" className={styles.itemShortcut}>
        {getShortcutLabel(shortcut)}
      </span>
    </button>
  );
}
