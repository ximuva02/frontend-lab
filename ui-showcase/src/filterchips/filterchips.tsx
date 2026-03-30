import { Button, Tag, TagGroup, TagList } from "react-aria-components";

import styles from "./filterchips.module.css";

const FilterChips = () => {
  return (
    <TagGroup className={styles.tagGroup}>
      <TagList className={styles.tagList}>
        <Tag className={styles.tag}>Chip 1</Tag>
        <Tag className={styles.tag}>Chip 2</Tag>
        <Tag className={styles.tag}>Chip 3</Tag>
      </TagList>
    </TagGroup>
  );
};

export default FilterChips;
