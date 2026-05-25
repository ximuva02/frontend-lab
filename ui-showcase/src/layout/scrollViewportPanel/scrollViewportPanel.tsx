import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./scrollViewportPanel.module.css";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@base-ui/react";

export type ScrollViewportPanelJumpDirection = "up" | "down" | "none";

export interface ScrollViewportPanelProps {
  header?: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  jumpDirection?: ScrollViewportPanelJumpDirection;
}

const ScrollViewportPanel = ({
  header,
  content,
  children,
  footer,
  jumpDirection = "down",
}: ScrollViewportPanelProps) => {
  const contentAreaRef = useRef<HTMLDivElement | null>(null);
  const [isJumpButtonVisible, setIsJumpButtonVisible] = useState(false);

  const updateJumpVisibility = useCallback(() => {
    const contentArea = contentAreaRef.current;

    if (!contentArea) {
      return;
    }

    if (jumpDirection === "none") {
      setIsJumpButtonVisible(false);
      return;
    }

    const distanceToEdge =
      jumpDirection === "up"
        ? contentArea.scrollTop
        : contentArea.scrollHeight -
          contentArea.scrollTop -
          contentArea.clientHeight;

    setIsJumpButtonVisible(distanceToEdge > 24);
  }, [jumpDirection]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateJumpVisibility);
    return () => window.cancelAnimationFrame(frame);
  }, [content, updateJumpVisibility]);

  const handleJump = () => {
    const contentArea = contentAreaRef.current;

    if (!contentArea) {
      return;
    }

    if (jumpDirection === "none") {
      return;
    }

    contentArea.scrollTo({
      top: jumpDirection === "up" ? 0 : contentArea.scrollHeight,
      behavior: "smooth",
    });
  };

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
          <div className={styles.scrollContent}>{content || children}</div>
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
