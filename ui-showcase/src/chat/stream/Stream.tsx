import ScrollViewportPanel from "../../layout/scrollViewportPanel/scrollViewportPanel";

interface StreamProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
}

const Stream = ({ children, content }: StreamProps) => {
  return (
    <ScrollViewportPanel
      content={content || children}
      header={<div>Header</div>}
      footer={<div>footer Bar</div>}
    />
  );
};

export default Stream;
