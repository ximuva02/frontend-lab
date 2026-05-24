import StreamItem from "../streamItem/StreamItem";
import { createStreamMockItems } from "./streamMockData";
import Stream from "./Stream";

export default {
  title: "Components/Chat/Stream",
  component: Stream,
};

const streamItems = createStreamMockItems(20);

export const Default = () => (
  <div style={{ height: "100vh" }}>
    <Stream
      content={streamItems.map((item) => (
        <StreamItem key={item.id} {...item} />
      ))}
    />
  </div>
);
