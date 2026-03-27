import type { PropsWithChildren } from "react";

import styles from "./contextMenu.module.css";

export function ContextMenuGroup({ children }: PropsWithChildren) {
  return <div className={styles.group}>{children}</div>;
}
