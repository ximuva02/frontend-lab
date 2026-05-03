import styles from "./contextButton.module.css";

import { Plus } from "lucide-react";
import { Menu } from "@base-ui/react";

const ContextButton = () => {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.contextButton}>
        <Plus size={14} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={styles.Positioner} sideOffset={8}>
          <Menu.Popup className={styles.Popup}>
            <Menu.Item
              className={styles.Item}
              onSelect={() => alert("Option 1 selected")}
            >
              Option 1
            </Menu.Item>
            <Menu.Item
              className={styles.Item}
              onSelect={() => alert("Option 2 selected")}
            >
              Option 2
            </Menu.Item>
            <Menu.Item
              className={styles.Item}
              onSelect={() => alert("Option 3 selected")}
            >
              Option 3
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default ContextButton;
