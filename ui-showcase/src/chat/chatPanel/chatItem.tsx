import styles from "./chatItem.module.css";
import LastUpdated from "../lastUpdated/LastUpdated";

const ChatItem = ({ children }) => {
  return (
    <div className={styles.chatItem}>
      <div>{children}</div>
      <div>
        <LastUpdated value={new Date()} />
      </div>
    </div>
  );
};

export default ChatItem;
