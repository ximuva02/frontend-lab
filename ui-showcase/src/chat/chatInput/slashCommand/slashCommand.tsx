import { useState } from "react";
import { Menu } from "@base-ui/react";
import styles from "./slashCommand.module.css";

interface SlashCommandProps {
  items: { label: string; onSelect: () => void }[];
  children: (props: {
    onInput: (e: React.FormEvent<HTMLDivElement>) => void;
  }) => React.ReactNode;
}

const SlashCommand = ({ items, children }: SlashCommandProps) => {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<
    { getBoundingClientRect: () => DOMRect } | undefined
  >(undefined);

  const getCaretRect = (): DOMRect | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    // getBoundingClientRect returns zero rect when caret is collapsed at end
    // fallback: return a non-zero rect if possible
    if (rect.width === 0 && rect.height === 0) return null;
    return rect;
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = (e.target as HTMLDivElement).textContent ?? "";
    const lastChar = text.at(-1);

    if (lastChar === "/") {
      const rect = getCaretRect();
      if (rect) {
        setAnchor({ getBoundingClientRect: () => rect });
        setOpen(true);
      }
    } else if (open) {
      setOpen(false);
    }
  };

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      {/* invisible trigger needed by base-ui, but we control open ourselves */}
      <Menu.Trigger style={{ display: "none" }} aria-hidden />

      {children({ onInput: handleInput })}

      <Menu.Portal>
        <Menu.Positioner
          className={styles.Positioner}
          anchor={anchor}
          sideOffset={6}
          side="top"
        >
          <Menu.Popup className={styles.Popup}>
            {items.map((item) => (
              <Menu.Item
                key={item.label}
                className={styles.Item}
                onSelect={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default SlashCommand;
