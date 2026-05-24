import styles from "./Avatar.module.css";

export type AvatarProps = {
  avatarUrl?: string;
  title?: string;
};

const Avatar = ({ avatarUrl, title }: AvatarProps) => {
  const fallbackLabel = (title ?? "").trim().charAt(0).toUpperCase() || "#";

  if (!avatarUrl) {
    return (
      <div className={styles.avatar}>
        <div className={styles.placeholder}>{fallbackLabel}</div>
      </div>
    );
  }
  return (
    <div className={styles.avatar}>
      <img
        src={avatarUrl}
        alt={`${title ?? "Stream"} avatar`}
        className={styles.avatarImage}
      />
    </div>
  );
};

export default Avatar;
