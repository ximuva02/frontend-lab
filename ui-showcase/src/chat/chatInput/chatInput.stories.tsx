import ChatInput from "./chatInput";
import ContextButton from "./contextButton";

export default {
  title: "Components/Chat/ChatInput",
  component: ChatInput,
};

export const Default = () => <ChatInput leadingActions={<ContextButton />} />;
