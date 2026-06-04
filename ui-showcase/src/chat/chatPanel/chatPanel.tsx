import { useState } from "react";
import ScrollViewportPanel from "../../layout/scrollViewportPanel/scrollViewportPanel";
import Avatar from "../avatar/Avatar";
import ChatInput from "../chatInput/chatInput";
// import LastUpdated from "../lastUpdated/LastUpdated";
import ChatItem from "./chatItem";

import styles from "./chatPanel.module.css";

interface Channel {
  avatarUrl?: string;
  title?: string;
  description?: string;
  lastUpdated?: number | Date;
}
const ChatHeader = ({
  avatarUrl,
  title,
  description,
  lastUpdated,
}: Channel) => {
  return (
    <div className={styles.chatHeader}>
      <Avatar avatarUrl={avatarUrl} title={title} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description ? (
          <div className={styles.description}>{description}</div>
        ) : null}
      </div>
    </div>
  );
};

export interface ChatPanelProps {
  channel?: Channel;
}

//TODO: show rendered markdown in chat items, not just plain text

const ChatPanel = ({
  channel = {
    title: "General",
    description: "General discussion about all things",
    lastUpdated: new Date(),
  },
}) => {
  const [chatItems, setChatItems] = useState<string[]>([
    "Hello, how are you?",
    "I'm good, thanks! How about you?",
    "Doing well, just working on a project.",
  ]);
  return (
    <ScrollViewportPanel
      header={<ChatHeader {...channel} />}
      footer={
        <ChatInput
          onSend={(message) => setChatItems([...chatItems, message])}
        />
      }
      jumpDirection="up"
    >
      {chatItems.map((item, index) => (
        <ChatItem key={index}>{item}</ChatItem>
      ))}
    </ScrollViewportPanel>
  );
};

export default ChatPanel;
