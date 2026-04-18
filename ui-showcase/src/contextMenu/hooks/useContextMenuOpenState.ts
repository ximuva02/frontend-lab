import { useRef, useState } from "react";

export function useContextMenuOpenState() {
  const [open, setOpen] = useState(false);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  function closeMenu() {
    setOpen(false);
  }

  return {
    closeMenu,
    open,
    restoreFocusRef,
    setOpen,
  };
}
