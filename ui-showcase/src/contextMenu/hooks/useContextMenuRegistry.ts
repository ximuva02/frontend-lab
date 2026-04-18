import { useCallback, useRef } from "react";

import type { RegisteredContextMenuAction } from "../contextMenu.types";

export function useContextMenuRegistry() {
  const actionsRef = useRef(new Map<string, RegisteredContextMenuAction>());

  const registerAction = useCallback((action: RegisteredContextMenuAction) => {
    actionsRef.current.set(action.id, action);

    return () => {
      actionsRef.current.delete(action.id);
    };
  }, []);

  return {
    actionsRef,
    registerAction,
  };
}
