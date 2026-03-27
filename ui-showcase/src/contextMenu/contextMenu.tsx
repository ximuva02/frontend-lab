import { Children, cloneElement, isValidElement, useRef } from "react";
import type { ReactElement, ReactNode } from "react";
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

function enhanceMenuNodes(
  nodes: ReactNode,
  onSelect: (itemName: string) => void,
): ReactNode {
  return Children.map(nodes, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === ContextMenuItem) {
      const props = child.props as ContextMenuItemProps;

      return cloneElement(child as ReactElement<ContextMenuItemProps>, {
        onSelect: (itemName, event) => {
          props.onSelect?.(itemName, event);
          onSelect(itemName);
        },
      });
    }

    const props = child.props as { children?: ReactNode };
    if (!props.children) {
      return child;
    }

    return cloneElement(child as ReactElement<{ children?: ReactNode }>, {
      children: enhanceMenuNodes(props.children, onSelect),
    });
  });
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

  const enhancedChildren = enhanceMenuNodes(children, handleItemSelect);

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
              {enhancedChildren}
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
