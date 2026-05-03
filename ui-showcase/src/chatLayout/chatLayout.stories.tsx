import type { Meta, StoryObj } from "@storybook/react-vite";

import ChatLayout from "./chatLayout";

const meta = {
  title: "Components/ChatLayout",
  component: ChatLayout,
  args: {
    leftWidth: 340,
    mobilePane: "left",
  },
  argTypes: {
    mobilePane: {
      control: "inline-radio",
      options: ["left", "right"],
    },
  },
} satisfies Meta<typeof ChatLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

function LeftArea() {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "grid",
        placeItems: "center",
        padding: "1.25rem",
        background: "linear-gradient(160deg, #e7f2ff, #d8e9ff)",
      }}
    >
      <strong style={{ color: "#1e3a5f", letterSpacing: "0.06em" }}>
        LEFT SLOT
      </strong>
    </div>
  );
}

function RightArea() {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "grid",
        placeItems: "center",
        padding: "1.25rem",
        background: "linear-gradient(160deg, #fff3de, #ffe8bf)",
      }}
    >
      <strong style={{ color: "#704610", letterSpacing: "0.06em" }}>
        RIGHT SLOT
      </strong>
    </div>
  );
}

export const Default: Story = {
  args: {
    left: null,
    right: null,
  },
  render: (args) => (
    <ChatLayout {...args} left={<LeftArea />} right={<RightArea />} />
  ),
};
