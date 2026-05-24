import LastUpdated from "./LastUpdated";

export default {
  title: "Components/Chat/LastUpdated",
  component: LastUpdated,
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const Today = () => <LastUpdated value={new Date()} />;

export const ThisWeek = () => <LastUpdated value={daysAgo(2)} />;

export const OlderDate = () => <LastUpdated value={daysAgo(12)} />;

export const InvalidValue = () => <LastUpdated value="invalid-date" />;
