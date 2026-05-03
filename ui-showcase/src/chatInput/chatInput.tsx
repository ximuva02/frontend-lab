import { Send } from "lucide-react";
import { Button } from "@base-ui/react";
import styles from "./chatInput.module.css";
import { useStructuredChatInput } from "./hooks/useStructuredChatInput";

interface ChatInputProps {
  leadingActions?: React.ReactNode;
  trailingActions?: React.ReactNode;
}

const ChatInput = ({ leadingActions, trailingActions }: ChatInputProps) => {
  const { inputRef, value, hasLeadHeading, handleInput, handleKeyDown } =
    useStructuredChatInput();

  return (
    <div className={styles.chatInput}>
      {leadingActions && (
        <div className={styles.leadingActions}>{leadingActions}</div>
      )}
      <textarea
        ref={inputRef}
        className={`${styles.input} ${hasLeadHeading ? styles.inputWithHeading : ""}`}
        rows={1}
        placeholder="Type your message..."
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      {trailingActions && (
        <div className={styles.trailingActions}>{trailingActions}</div>
      )}
      <Button>
        <Send size={14} />
      </Button>
    </div>
  );
};

export default ChatInput;
