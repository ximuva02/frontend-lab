import { createContext, useContext } from "react";

import type { ContextMenuContextValue } from "./contextMenu.types";

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export function useContextMenuContext() {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error(
      "ContextMenu components must be used inside ContextMenu.Root.",
    );
  }

  return context;
}

export { ContextMenuContext };
