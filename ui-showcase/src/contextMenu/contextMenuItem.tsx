import type { MouseEvent, ReactNode } from "react";

import styles from "./contextMenu.module.css";
import { useHotkeys, type Keys } from "react-hotkeys-hook";
export interface ContextMenuItemProps {
  name: string;
  icon?: ReactNode;
  shortCut?: Keys;
  disabled?: boolean;
  children?: ReactNode;
  onSelect?: (
    itemName: string,
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent,
  ) => void;
}

export function ContextMenuItem({
  name,
  icon,
  shortCut,
  disabled = false,
  children,
  onSelect,
}: ContextMenuItemProps) {
  const handleSelect = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    onSelect?.(name, event);
  };

  useHotkeys(
    shortCut || "",
    (event) => {
      if (disabled) {
        return;
      }

      onSelect?.(name, event);
    },
    [disabled, name, onSelect],
  );

  return (
    <button
      type="button"
      className={styles.item}
      onClick={handleSelect}
      disabled={disabled}
      role="menuitem"
    >
      <span className={styles.itemIcon}>{icon}</span>
      <span>{name}</span>
      <span className={styles.itemShortcut}>
        {shortCut}
        {children}
      </span>
    </button>
  );
}
