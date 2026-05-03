import type { CSSProperties, ReactNode } from "react";
import styles from "./chatLayout.module.css";

type MobilePane = "left" | "right";

export interface ChatLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftWidth?: number | string;
  mobilePane?: MobilePane;
}

const ChatLayout = ({
  left,
  right,
  leftWidth = 360,
  mobilePane = "left",
}: ChatLayoutProps) => {
  const style = {
    "--chat-layout-left-width":
      typeof leftWidth === "number" ? `${leftWidth}px` : leftWidth,
  } as CSSProperties;

  return (
    <div
      className={styles.chatLayout}
      data-mobile-pane={mobilePane}
      style={style}
    >
      <section className={`${styles.pane} ${styles.leftPane}`}>{left}</section>
      <section className={`${styles.pane} ${styles.rightPane}`}>
        {right}
      </section>
    </div>
  );
};

export default ChatLayout;
