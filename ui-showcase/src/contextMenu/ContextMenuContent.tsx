import { FloatingPortal } from "@floating-ui/react";

import { mergeClassNames } from "../shared/utils/mergeClassNames";
import { useContextMenuContext } from "./contextMenu.context";
import styles from "./contextMenu.module.css";
import { useMenuInteractions } from "./hooks";
import type { ContextMenuContentProps } from "./contextMenu.types";

export function ContextMenuContent({
  ariaLabel,
  children,
  className,
}: ContextMenuContentProps) {
  const { closeMenu, floatingStyles, menuRef, open, refs } =
    useContextMenuContext();
  const { handleMenuKeyDown } = useMenuInteractions({
    closeMenu,
    menuRef,
    open,
  });

  return (
    <FloatingPortal>
      <>
        {open ? <div className={styles.overlay} aria-hidden="true" /> : null}
        <div
          ref={(node) => {
            menuRef.current = node;
            refs.setFloating(node);
          }}
          role="menu"
          aria-label={ariaLabel}
          aria-hidden={!open}
          className={mergeClassNames(styles.menu, className)}
          data-open={open ? "true" : "false"}
          onKeyDown={handleMenuKeyDown}
          style={floatingStyles}
        >
          {children}
        </div>
      </>
    </FloatingPortal>
  );
}
