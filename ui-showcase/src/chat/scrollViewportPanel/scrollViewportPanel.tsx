import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./scrollViewportPanel.module.css";

import { ArrowDown } from "lucide-react";
import { Button } from "@base-ui/react";

export interface ScrollViewportPanelProps {
  header: ReactNode;
  content: ReactNode;
  chatBar: ReactNode;
}

const ScrollViewportPanel = ({
  header,
  content,
  chatBar,
}: ScrollViewportPanelProps) => {
  const contentAreaRef = useRef<HTMLDivElement | null>(null);
  const [showJumpToEnd, setShowJumpToEnd] = useState(false);

  const updateJumpVisibility = useCallback(() => {
    const contentArea = contentAreaRef.current;

    if (!contentArea) {
      return;
    }

    const distanceToBottom =
      contentArea.scrollHeight -
      contentArea.scrollTop -
      contentArea.clientHeight;
    setShowJumpToEnd(distanceToBottom > 24);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateJumpVisibility);
    return () => window.cancelAnimationFrame(frame);
  }, [content, updateJumpVisibility]);

  const handleJumpToEnd = () => {
    const contentArea = contentAreaRef.current;

    if (!contentArea) {
      return;
    }

    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: "smooth" });
  };

  return (
    <section className={styles.chatPanel}>
      <header className={styles.header}>{header}</header>

      <div className={styles.contentFrame}>
        <div
          className={styles.contentArea}
          onScroll={updateJumpVisibility}
          ref={contentAreaRef}
        >
          <div className={styles.scrollContent}>{content}</div>
        </div>
        {showJumpToEnd ? (
          <div className={styles.jumpToEnd}>
            <Button
              className={styles.jumpToEndButton}
              onClick={handleJumpToEnd}
              type="button"
              aria-label="jump to end"
            >
              <ArrowDown />
            </Button>
          </div>
        ) : null}
      </div>

      <footer className={styles.chatBar}>{chatBar}</footer>
    </section>
  );
};

export default ScrollViewportPanel;
