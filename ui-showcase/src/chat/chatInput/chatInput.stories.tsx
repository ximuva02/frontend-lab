import ChatInput from "./chatInput";
import ContextButton from "./contextButton";

export default {
  title: "Components/ChatInput",
  component: ChatInput,
};

export const Default = () => <ChatInput leadingActions={<ContextButton />} />;
