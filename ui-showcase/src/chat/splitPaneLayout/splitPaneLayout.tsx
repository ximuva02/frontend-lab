import type { CSSProperties, ReactNode } from "react";
import styles from "./splitPaneLayout.module.css";

type MobilePane = "left" | "right";

export interface SplitPaneLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftWidth?: number | string;
  mobilePane?: MobilePane;
}

const SplitPaneLayout = ({
  left,
  right,
  leftWidth = 360,
  mobilePane = "left",
}: SplitPaneLayoutProps) => {
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

export type ChatLayoutProps = SplitPaneLayoutProps;
export const ChatLayout = SplitPaneLayout;

export default SplitPaneLayout;
