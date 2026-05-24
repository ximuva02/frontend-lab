import type { ReactNode } from "react";
import StreamItem, { type StreamItemData } from "../streamItem/StreamItem";
import ScrollViewportPanel from "../../layout/scrollViewportPanel/scrollViewportPanel";

export interface StreamItemsProps {
  items?: StreamItemData[];
  sortOrder?: "asc" | "desc";
}

export interface StreamRootProps extends StreamItemsProps {
  children?: React.ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

const StreamItems = ({ items = [], sortOrder = "desc" }: StreamItemsProps) => {
  const sortedItems = [...items].sort((a, b) =>
    sortOrder === "desc"
      ? b.lastUpdated - a.lastUpdated
      : a.lastUpdated - b.lastUpdated,
  );

  const content = sortedItems.map((item, index) => (
    <StreamItem key={`${item.title}-${item.lastUpdated}-${index}`} {...item} />
  ));

  return <>{content}</>;
};

const StreamRoot = ({
  children,
  items,
  header = <div>Header</div>,
  footer = <div>footer Bar</div>,
  sortOrder = "desc",
}: StreamRootProps) => {
  const content = items ? (
    <StreamItems items={items} sortOrder={sortOrder} />
  ) : (
    children
  );

  return (
    <ScrollViewportPanel content={content} header={header} footer={footer} />
  );
};

const Stream = Object.assign(StreamRoot, {
  Root: StreamRoot,
  Items: StreamItems,
});

export default Stream;
