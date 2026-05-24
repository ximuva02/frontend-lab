import { createStreamMockItems } from "./streamMockData";
import Stream from "./Stream";

export default {
  title: "Components/Chat/Stream",
  component: Stream,
};

const streamItems = createStreamMockItems(20);

export const Default = () => (
  <div style={{ height: "40vh" }}>
    <Stream.Root>
      <Stream.Items items={streamItems} />
    </Stream.Root>
  </div>
);
