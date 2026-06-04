import type { ReactNode } from "react";
import StreamItem, { type StreamItemData } from "../streamItem/StreamItem";
import ScrollViewportPanel, {
  type ScrollViewportPanelJumpDirection,
} from "../../layout/scrollViewportPanel/scrollViewportPanel";

export interface StreamItemsProps {
  items?: StreamItemData[];
  sortOrder?: "asc" | "desc";
}

export interface StreamRootProps extends StreamItemsProps {
  children?: React.ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  jumpDirection?: ScrollViewportPanelJumpDirection;
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
  jumpDirection,
}: StreamRootProps) => {
  const content = items ? (
    <StreamItems items={items} sortOrder={sortOrder} />
  ) : (
    children
  );

  const effectiveJumpDirection =
    jumpDirection ?? (sortOrder === "desc" ? "up" : "down");

  return (
    <ScrollViewportPanel
      header={header}
      footer={footer}
      jumpDirection={effectiveJumpDirection}
    >
      {content}
    </ScrollViewportPanel>
  );
};

const Stream = Object.assign(StreamRoot, {
  Root: StreamRoot,
  Items: StreamItems,
});

export default Stream;
