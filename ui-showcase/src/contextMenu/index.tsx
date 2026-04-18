import { ContextMenuContent } from "./ContextMenuContent";
import { ContextMenuItem } from "./ContextMenuItem";
import { ContextMenuRoot } from "./ContextMenuRoot";
import { ContextMenuSeparator } from "./ContextMenuSeparator";
import { ContextMenuTarget } from "./ContextMenuTarget";

const ContextMenu = {
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Root: ContextMenuRoot,
  Separator: ContextMenuSeparator,
  Target: ContextMenuTarget,
};

export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTarget,
};
export type {
  ContextMenuContentProps,
  ContextMenuItemActionDetails,
  ContextMenuItemProps,
  ContextMenuRootProps,
  ContextMenuShortcut,
  ContextMenuShortcutScope,
  ContextMenuTargetProps,
} from "./contextMenu.types";

export default ContextMenu;
