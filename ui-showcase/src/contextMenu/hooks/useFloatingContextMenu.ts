import { useCallback, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import type { VirtualElement } from "@floating-ui/react";

function createVirtualReference(x: number, y: number): VirtualElement {
  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x,
      y,
      top: y,
      left: x,
      right: x,
      bottom: y,
      toJSON: () => ({}),
    }),
  };
}

export function useFloatingContextMenu() {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, update } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const openAtPosition = useCallback(
    (nextX: number, nextY: number) => {
      refs.setPositionReference(createVirtualReference(nextX, nextY));
      setOpen(true);
    },
    [refs],
  );

  const handleOpen = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      openAtPosition(event.clientX, event.clientY);
    },
    [openAtPosition],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    floatingStyles,
    handleClose,
    handleOpen,
    open,
    openAtPosition,
    refs,
    update,
  };
}
