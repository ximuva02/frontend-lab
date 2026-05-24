import type { Meta, StoryObj } from "@storybook/react-vite";
import ScrollViewportPanel from "./scrollViewportPanel";

const meta = {
  title: "Components/Layout/ScrollViewportPanel",
  component: ScrollViewportPanel,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScrollViewportPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StructureOnly: Story = {
  args: {
    header: null,
    content: null,
    footer: null,
  },
  render: () => (
    <div style={{ height: "100vh", padding: "1rem", background: "#f0f2f5" }}>
      <div style={{ height: "100%", border: "1px solid #d9d9d9" }}>
        <ScrollViewportPanel
          header={
            <div
              style={{
                minHeight: "3.5rem",
                display: "grid",
                placeItems: "center",
                background: "#dceeff",
                color: "#1d3d5c",
                fontWeight: 600,
              }}
            >
              HEADER
            </div>
          }
          content={
            <div
              style={{
                minHeight: "120vh",
                display: "grid",
                placeItems: "center",
                borderRadius: "0.5rem",
                background: "#f8f0de",
                color: "#6a4b1e",
                fontWeight: 600,
              }}
            >
              SCROLLABLE CONTENT AREA
            </div>
          }
          footer={
            <div
              style={{
                minHeight: "4.5rem",
                display: "grid",
                placeItems: "center",
                background: "#ddeed6",
                color: "#2f5226",
                fontWeight: 600,
              }}
            >
              FIXED FOOTER
            </div>
          }
        />
      </div>
    </div>
  ),
};
