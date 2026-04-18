import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { ContextMenu } from "./index";

function ContextMenuHarness() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div>
      <ContextMenu.Root>
        <ContextMenu.Target aria-label="Canvas area">
          <span>Canvas</span>
        </ContextMenu.Target>
        <ContextMenu.Content ariaLabel="Canvas actions">
          <ContextMenu.Item
            id="open"
            shortcut={{ keys: "Enter", scope: "target" }}
            onAction={() => setLastAction("open")}
          >
            Open
          </ContextMenu.Item>
          <ContextMenu.Item
            id="rename"
            shortcut={{ keys: "F2", scope: "target" }}
            onAction={() => setLastAction("rename")}
          >
            Rename
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item
            id="duplicate"
            shortcut={{ keys: "Ctrl+D", scope: "global" }}
            onAction={() => setLastAction("duplicate")}
          >
            Duplicate
          </ContextMenu.Item>
          <ContextMenu.Item
            id="delete"
            disabled
            onAction={() => setLastAction("delete")}
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>

      <label>
        Search
        <input aria-label="Search" />
      </label>

      <output aria-label="Last action">{lastAction}</output>
    </div>
  );
}

describe("ContextMenu", () => {
  it("opens on right click and triggers a menu action", async () => {
    const user = userEvent.setup();

    render(<ContextMenuHarness />);

    const target = screen.getByLabelText("Canvas area");
    fireEvent.contextMenu(target, { clientX: 40, clientY: 80 });

    const menu = screen.getByRole("menu", { name: "Canvas actions" });
    expect(menu).toBeVisible();

    await user.click(screen.getByRole("menuitem", { name: "Open" }));
    expect(screen.getByLabelText("Last action")).toHaveTextContent("open");
    expect(target).toHaveAttribute("aria-expanded", "false");
  });

  it("opens with Shift+F10, supports arrow navigation and restores focus on escape", async () => {
    const user = userEvent.setup();

    render(<ContextMenuHarness />);

    const target = screen.getByLabelText("Canvas area");
    target.focus();

    await user.keyboard("{Shift>}{F10}{/Shift}");

    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Open" })).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(target).toHaveFocus();
  });

  it("does not activate disabled items", async () => {
    const user = userEvent.setup();

    render(<ContextMenuHarness />);

    const target = screen.getByLabelText("Canvas area");
    fireEvent.contextMenu(target, { clientX: 20, clientY: 20 });

    const disabledItem = screen.getByRole("menuitem", { name: "Delete" });
    expect(disabledItem).toBeDisabled();

    await user.click(disabledItem);
    expect(screen.getByLabelText("Last action")).toHaveTextContent("none");
  });

  it("runs target shortcuts only while the target is focused", async () => {
    const user = userEvent.setup();

    render(<ContextMenuHarness />);

    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Last action")).toHaveTextContent("none");

    const target = screen.getByLabelText("Canvas area");
    target.focus();

    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Last action")).toHaveTextContent("open");
  });

  it("runs global shortcuts but ignores text inputs", async () => {
    const user = userEvent.setup();

    render(<ContextMenuHarness />);

    const input = screen.getByLabelText("Search");
    input.focus();

    await user.keyboard("{Control>}d{/Control}");
    expect(screen.getByLabelText("Last action")).toHaveTextContent("none");

    input.blur();

    await user.keyboard("{Control>}d{/Control}");
    expect(screen.getByLabelText("Last action")).toHaveTextContent("duplicate");
  });
});
