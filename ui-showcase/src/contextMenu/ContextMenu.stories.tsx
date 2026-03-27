import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { ContextMenu } from "./contextMenu";
import { ContextMenuGroup } from "./ContextMenuGroup";
import { ContextMenuItem } from "./contextMenuItem";

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  subcomponents: {
    ContextMenuGroup,
    ContextMenuItem,
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Grouped: Story = {
  args: {
    trigger: null,
    onItemSelect: fn(),
  },
  render: (args) => (
    <div style={{ padding: "2rem" }}>
      <ContextMenu
        {...args}
        trigger={
          <div
            style={{
              width: "320px",
              border: "1px dashed #b7bec8",
              borderRadius: "12px",
              padding: "4rem 2rem",
              textAlign: "center",
              background: "linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%)",
            }}
          >
            Right click in this area
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                color: "#5f6b7a",
              }}
            >
              Or focus and press Shift+F10, Menu, Enter, or Space
            </div>
          </div>
        }
        menuItems={[
          {
            name: "Rename",
            icon: <span aria-hidden="true">R</span>,
            shortCut: "F2",
          },
          {
            name: "Duplicate",
            icon: <span aria-hidden="true">D</span>,
            shortCut: "Ctrl+D",
          },
        ]}
      >
        <ContextMenuItem
          name="Open"
          icon={<span aria-hidden="true">O</span>}
          shortCut="Enter"
        />
        <ContextMenuGroup>
          <ContextMenuItem
            name="Copy"
            icon={<span aria-hidden="true">C</span>}
            shortCut="Ctrl+C"
          />
          <ContextMenuItem
            name="Paste"
            icon={<span aria-hidden="true">P</span>}
            shortCut="Ctrl+V"
          />
        </ContextMenuGroup>
        <ContextMenuItem
          name="Delete"
          icon={<span aria-hidden="true">X</span>}
          shortCut="Del"
        />
      </ContextMenu>
    </div>
  ),
};
