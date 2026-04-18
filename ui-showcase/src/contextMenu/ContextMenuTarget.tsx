import type { MouseEvent, KeyboardEvent } from "react";

import { mergeClassNames } from "../shared/utils/mergeClassNames";
import { useContextMenuContext } from "./contextMenu.context";
import styles from "./contextMenu.module.css";
import type { ContextMenuTargetProps } from "./contextMenu.types";

export function ContextMenuTarget({
  children,
  className,
  tabIndex,
  ...props
}: ContextMenuTargetProps) {
  const { open, openAtPoint, openFromTarget, targetRef } =
    useContextMenuContext();

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    props.onContextMenu?.(event);

    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    openAtPoint(event.clientX, event.clientY, {
      restoreFocusTo: event.currentTarget,
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    props.onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const isMenuShortcut =
      event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");

    if (!isMenuShortcut) {
      return;
    }

    event.preventDefault();
    openFromTarget();
  }

  return (
    <div
      {...props}
      ref={targetRef}
      className={mergeClassNames(styles.target, className)}
      data-open={open ? "true" : "false"}
      tabIndex={tabIndex ?? 0}
      aria-haspopup="menu"
      aria-expanded={open}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
