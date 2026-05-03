import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { fn } from "storybook/test";

import { ContextMenu } from "./index";

interface ContextMenuStoryArgs {
  targetHeading: string;
  targetDescription: string;
  ariaLabel: string;
  openLabel: string;
  renameLabel: string;
  duplicateLabel: string;
  deleteLabel: string;
  openShortcutLabel: string;
  renameShortcutLabel: string;
  duplicateShortcutLabel: string;
  renameDisabled: boolean;
  deleteDisabled: boolean;
  duplicateShortcutScope: "global" | "target";
  onOpenAction: (payload: { id: string; source: "menu" | "shortcut" }) => void;
  onRenameAction: (payload: {
    id: string;
    source: "menu" | "shortcut";
  }) => void;
  onDuplicateAction: (payload: {
    id: string;
    source: "menu" | "shortcut";
  }) => void;
  onDeleteAction: (payload: {
    id: string;
    source: "menu" | "shortcut";
  }) => void;
}

function ContextMenuShowcase({
  ariaLabel,
  deleteDisabled,
  deleteLabel,
  duplicateLabel,
  duplicateShortcutLabel,
  duplicateShortcutScope,
  onDeleteAction,
  onDuplicateAction,
  onOpenAction,
  onRenameAction,
  openLabel,
  openShortcutLabel,
  renameDisabled,
  renameLabel,
  renameShortcutLabel,
  targetDescription,
  targetHeading,
}: ContextMenuStoryArgs) {
  const [lastAction, setLastAction] = useState("Noch keine Aktion");

  return (
    <div style={{ display: "grid", gap: "1rem", minWidth: "22rem" }}>
      <ContextMenu.Root>
        <ContextMenu.Target aria-label="Context menu target">
          <strong>{targetHeading}</strong>
          <span style={{ color: "var(--text-color-placeholder)" }}>
            {targetDescription}
          </span>
        </ContextMenu.Target>
        <ContextMenu.Content ariaLabel={ariaLabel}>
          <ContextMenu.Item
            id="open"
            shortcut={{
              keys: "Enter",
              label: openShortcutLabel,
              scope: "target",
            }}
            onAction={(details) => {
              setLastAction(`${openLabel} (${details.source})`);
              onOpenAction(details);
            }}
          >
            {openLabel}
          </ContextMenu.Item>
          <ContextMenu.Item
            id="rename"
            disabled={renameDisabled}
            shortcut={{
              keys: "F2",
              label: renameShortcutLabel,
              scope: "target",
            }}
            onAction={(details) => {
              setLastAction(`${renameLabel} (${details.source})`);
              onRenameAction(details);
            }}
          >
            {renameLabel}
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item
            id="duplicate"
            shortcut={{
              keys: "Ctrl+D",
              label: duplicateShortcutLabel,
              scope: duplicateShortcutScope,
            }}
            onAction={(details) => {
              setLastAction(`${duplicateLabel} (${details.source})`);
              onDuplicateAction(details);
            }}
          >
            {duplicateLabel}
          </ContextMenu.Item>
          <ContextMenu.Item
            id="delete"
            disabled={deleteDisabled}
            onAction={(details) => {
              setLastAction(`${deleteLabel} (${details.source})`);
              onDeleteAction(details);
            }}
          >
            {deleteLabel}
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <p style={{ margin: 0 }}>Letzte Aktion: {lastAction}</p>
    </div>
  );
}

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenuShowcase,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    targetHeading: { control: "text" },
    targetDescription: { control: "text" },
    ariaLabel: { control: "text" },
    openLabel: { control: "text" },
    renameLabel: { control: "text" },
    duplicateLabel: { control: "text" },
    deleteLabel: { control: "text" },
    openShortcutLabel: { control: "text" },
    renameShortcutLabel: { control: "text" },
    duplicateShortcutLabel: { control: "text" },
    renameDisabled: { control: "boolean" },
    deleteDisabled: { control: "boolean" },
    duplicateShortcutScope: {
      control: "inline-radio",
      options: ["global", "target"],
    },
    onOpenAction: { action: "open" },
    onRenameAction: { action: "rename" },
    onDuplicateAction: { action: "duplicate" },
    onDeleteAction: { action: "delete" },
  },
  args: {
    targetHeading: "Rechtsklick oder Shift+F10",
    targetDescription:
      "Zielbereich fuer das Kontextmenue und zielgebundene Shortcuts",
    ariaLabel: "Dateiaktionen",
    openLabel: "Open",
    renameLabel: "Rename",
    duplicateLabel: "Duplicate",
    deleteLabel: "Delete",
    openShortcutLabel: "Enter",
    renameShortcutLabel: "F2",
    duplicateShortcutLabel: "Ctrl+D",
    renameDisabled: false,
    deleteDisabled: true,
    duplicateShortcutScope: "global",
    onOpenAction: fn(),
    onRenameAction: fn(),
    onDuplicateAction: fn(),
    onDeleteAction: fn(),
  },
} satisfies Meta<typeof ContextMenuShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TargetScopedShortcuts: Story = {
  args: {
    duplicateShortcutScope: "target",
    deleteDisabled: false,
  },
};
