import StreamItem from "../streamItem/StreamItem";
import Stream from "./Stream";

export default {
  title: "Components/Chat/Stream",
  component: Stream,
};

const streamItems = Array.from({ length: 20 }, (_, i) => {
  const avatarUrl = `https://i.pravatar.cc/150?img=${i + 1}`;
  const title = "John Doe";
  const description = "Hello, this is a stream item!";
  const lastUpdated = new Date();
  return { avatarUrl, title, description, lastUpdated };
});

export const Default = () => (
  <div style={{ height: "100vh" }}>
    <Stream
      content={streamItems.map((item) => (
        <StreamItem key={item.title} {...item} />
      ))}
    />
  </div>
);
