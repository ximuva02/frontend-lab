import styles from "./StreamItem.module.css";
import Avatar from "../avatar/Avatar";
import LastUpdated, { type LastUpdatedValue } from "../lastUpdated/LastUpdated";

export type StreamItemProps = {
  avatarUrl?: string;
  title?: string;
  description?: string;
  lastUpdated?: LastUpdatedValue;
};

export type StreamItemData = Omit<StreamItemProps, "title" | "lastUpdated"> & {
  title: string;
  lastUpdated: number;
};

export type StreamItemRootProps = StreamItemProps;

const StreamItemRoot = ({
  avatarUrl,
  title = "John Doe",
  description,
  lastUpdated = new Date(),
}: StreamItemRootProps) => {
  return (
    <div className={styles.streamItem}>
      <Avatar avatarUrl={avatarUrl} title={title} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description ? (
          <div className={styles.description}>{description}</div>
        ) : null}
      </div>
      <div className={styles.actions}>
        <LastUpdated value={lastUpdated} />
      </div>
    </div>
  );
};

const StreamItem = Object.assign(StreamItemRoot, {
  Root: StreamItemRoot,
});

export default StreamItem;
