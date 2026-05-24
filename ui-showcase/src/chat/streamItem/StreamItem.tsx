import styles from "./StreamItem.module.css";
import Avatar from "../avatar/Avatar";
import LastUpdated, { type LastUpdatedValue } from "../lastUpdated/LastUpdated";

export type StreamItemProps = {
  avatarUrl?: string;
  title?: string;
  description?: string;
  lastUpdated?: LastUpdatedValue;
};

const StreamItem = ({
  avatarUrl,
  title = "John Doe",
  description = "Hello, this is a stream item!",
  lastUpdated = new Date(),
}: StreamItemProps) => {
  return (
    <div className={styles.streamItem}>
      <Avatar avatarUrl={avatarUrl} title={title} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>

      <div className={styles.actions}>
        <LastUpdated value={lastUpdated} />
      </div>
    </div>
  );
};

export default StreamItem;
