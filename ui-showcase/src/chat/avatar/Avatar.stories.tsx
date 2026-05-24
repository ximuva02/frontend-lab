import Avatar, { type AvatarProps } from "./Avatar";

export default {
  title: "Components/Chat/Avatar",
  component: Avatar,
  args: {
    title: "John Doe",
  },
};

export const Default = (args: AvatarProps) => <Avatar {...args} />;
