import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { useRef } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
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

interface OpenMenuOptions {
  restoreFocusTo?: HTMLElement | null;
}

interface UseContextMenuPositioningOptions {
  open: boolean;
  restoreFocusRef: MutableRefObject<HTMLElement | null>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function useContextMenuPositioning({
  open,
  restoreFocusRef,
  setOpen,
}: UseContextMenuPositioningOptions) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { floatingStyles, refs, update } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });

  function openAtPoint(x: number, y: number, options?: OpenMenuOptions) {
    restoreFocusRef.current = options?.restoreFocusTo ?? null;
    refs.setPositionReference(createVirtualReference(x, y));
    setOpen(true);
  }

  function openFromTarget() {
    const targetElement = targetRef.current;

    if (!targetElement) {
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    openAtPoint(rect.left + 12, rect.top + Math.min(rect.height, 20), {
      restoreFocusTo: targetElement,
    });
  }

  return {
    floatingStyles,
    openAtPoint,
    openFromTarget,
    refs,
    targetRef,
    update,
  };
}
