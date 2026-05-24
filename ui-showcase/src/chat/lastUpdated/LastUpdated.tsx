import { format, isThisWeek, isToday, isValid, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export type LastUpdatedValue = Date | string | number;

type LastUpdatedProps = {
  value?: LastUpdatedValue;
};

const toDate = (value: LastUpdatedValue): Date | null => {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value === "number") {
    const parsedNumberDate = new Date(value);
    return isValid(parsedNumberDate) ? parsedNumberDate : null;
  }

  const parsedIsoDate = parseISO(value);

  if (isValid(parsedIsoDate)) {
    return parsedIsoDate;
  }

  const parsedTextDate = new Date(value);
  return isValid(parsedTextDate) ? parsedTextDate : null;
};

const formatLastUpdated = (value?: LastUpdatedValue): string => {
  if (value === undefined) {
    return "";
  }

  const parsedDate = toDate(value);

  if (!parsedDate) {
    return String(value);
  }

  if (isToday(parsedDate)) {
    return format(parsedDate, "HH:mm");
  }

  if (isThisWeek(parsedDate, { weekStartsOn: 1 })) {
    return format(parsedDate, "EEE", { locale: de }).replace(".", "");
  }

  return format(parsedDate, "dd.MM.yyyy");
};

const LastUpdated = ({ value }: LastUpdatedProps) => {
  return <span>{formatLastUpdated(value)}</span>;
};

export default LastUpdated;
