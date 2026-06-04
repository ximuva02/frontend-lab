import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./scrollViewportPanel.module.css";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@base-ui/react";
import useScrollJump from "./useScrollJump";

export type ScrollViewportPanelJumpDirection = "up" | "down" | "none";

export interface ScrollViewportPanelProps {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  jumpDirection?: ScrollViewportPanelJumpDirection;
}

const ScrollViewportPanel = ({
  header,
  children,
  footer,
  jumpDirection = "down",
}: ScrollViewportPanelProps) => {
  const {
    contentAreaRef,
    isJumpButtonVisible,
    handleJump,
    updateJumpVisibility,
  } = useScrollJump(jumpDirection);

  const jumpAriaLabel = jumpDirection === "up" ? "jump to top" : "jump to end";

  return (
    <section className={styles.chatPanel}>
      <header className={styles.header}>{header}</header>

      <div className={styles.contentFrame}>
        <div
          className={styles.contentArea}
          onScroll={updateJumpVisibility}
          ref={contentAreaRef}
        >
          <div className={styles.scrollContent}>{children}</div>
        </div>
        {isJumpButtonVisible ? (
          <div className={styles.jumpToEnd}>
            <Button
              className={styles.jumpToEndButton}
              onClick={handleJump}
              type="button"
              aria-label={jumpAriaLabel}
            >
              {jumpDirection === "up" ? <ArrowUp /> : <ArrowDown />}
            </Button>
          </div>
        ) : null}
      </div>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
};

export default ScrollViewportPanel;
