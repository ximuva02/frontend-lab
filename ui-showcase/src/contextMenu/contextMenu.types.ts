import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";

export type ContextMenuShortcutScope = "global" | "target";

export interface ContextMenuShortcut {
  keys: string;
  label?: string;
  scope?: ContextMenuShortcutScope;
  allowInTextInput?: boolean;
  preventDefault?: boolean;
}

export interface ContextMenuItemActionDetails {
  id: string;
  source: "menu" | "shortcut";
}

export interface ContextMenuRootProps {
  children: ReactNode;
}

export interface ContextMenuTargetProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children: ReactNode;
}

export interface ContextMenuContentProps {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}

export interface ContextMenuItemProps {
  id: string;
  children: ReactNode;
  shortcut?: ContextMenuShortcut;
  disabled?: boolean;
  className?: string;
  onAction?: (details: ContextMenuItemActionDetails) => void;
}

export interface RegisteredContextMenuAction {
  disabled: boolean;
  execute: () => void;
  id: string;
  shortcut?: ContextMenuShortcut;
}

export interface ContextMenuContextValue {
  closeMenu: () => void;
  floatingStyles: CSSProperties;
  menuRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  openAtPoint: (
    x: number,
    y: number,
    options?: { restoreFocusTo?: HTMLElement | null },
  ) => void;
  openFromTarget: () => void;
  registerAction: (action: RegisteredContextMenuAction) => () => void;
  refs: {
    setFloating: (node: HTMLDivElement | null) => void;
  };
  targetRef: RefObject<HTMLDivElement | null>;
}
