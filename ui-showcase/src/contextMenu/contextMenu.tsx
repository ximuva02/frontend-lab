import { useRef } from "react";
import type { ReactNode } from "react";
import { FloatingPortal } from "@floating-ui/react";

import styles from "./contextMenu.module.css";
import { useFloatingContextMenu } from "./hooks/useFloatingContextMenu";
import { useMenuFocusRestore } from "./hooks/useMenuFocusRestore";
import { useMenuKeyboardNavigation } from "./hooks/useMenuKeyboardNavigation";
import { ContextMenuItem, type ContextMenuItemProps } from "./contextMenuItem";
import { mergeClassNames } from "../shared/utils/mergeClassNames";

export interface ContextMenuProps {
  trigger: ReactNode;
  children?: ReactNode;
  className?: string;
  menuItems?: ContextMenuItemProps[];
  onItemSelect?: (itemName: string) => void;
}

export function ContextMenu({
  trigger,
  children,
  className,
  menuItems = [],
  onItemSelect,
}: ContextMenuProps) {
  const {
    floatingStyles,
    handleClose,
    handleOpen,
    open,
    openAtPosition,
    refs,
    update,
  } = useFloatingContextMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { focusMenuItem } = useMenuKeyboardNavigation({
    handleClose,
    menuRef,
    open,
    openAtPosition,
    triggerRef,
  });

  useMenuFocusRestore({
    menuRef,
    open,
    focusMenuItem,
    triggerRef,
    update,
  });

  const handleItemSelect = (itemName: string) => {
    onItemSelect?.(itemName);
    handleClose();
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onContextMenu={handleOpen}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>
      <FloatingPortal>
        {open ? (
          <>
            <div
              className={styles.overlay}
              onClick={handleClose}
              onContextMenu={(event) => {
                event.preventDefault();
                handleClose();
              }}
              onWheel={handleClose}
            />

            <div
              ref={(node) => {
                menuRef.current = node;
                refs.setFloating(node);
              }}
              className={mergeClassNames(
                styles.menu,
                open ? styles.menuOpen : undefined,
                className,
              )}
              role="menu"
              aria-hidden={!open}
              tabIndex={open ? 0 : -1}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  handleClose();
                }
              }}
              style={floatingStyles}
            >
              {children}
              {menuItems.map((item) => (
                <ContextMenuItem
                  key={item.name}
                  {...item}
                  onSelect={(itemName, event) => {
                    item.onSelect?.(itemName, event);
                    handleItemSelect(itemName);
                  }}
                />
              ))}
            </div>
          </>
        ) : null}
      </FloatingPortal>
    </>
  );
}
