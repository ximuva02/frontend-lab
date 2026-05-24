import { faker } from "@faker-js/faker";
import type { StreamItemProps } from "../streamItem/StreamItem";
import {
  streamGroups,
  streamIdeas,
  streamTopics,
  streamUserNotes,
} from "../../test/mockData/streamTextCatalog";

const compactDescription = () => {
  if (faker.datatype.boolean({ probability: 0.35 })) {
    return undefined;
  }

  const variant = faker.helpers.arrayElement([
    "single",
    "twoPart",
    "loose",
  ] as const);

  if (variant === "single") {
    return faker.helpers.arrayElement(streamUserNotes);
  }

  if (variant === "twoPart") {
    return `${faker.helpers.arrayElement(streamUserNotes)}, ${faker.helpers.arrayElement(streamUserNotes)}.`;
  }

  return `${faker.helpers.arrayElement(["idee", "notiz", "update"])}: ${faker.helpers.arrayElement(streamUserNotes)}`;
};

const compactTitle = () => {
  const kind = faker.helpers.arrayElement(["topic", "group", "idea"] as const);

  if (kind === "topic") {
    return faker.helpers.arrayElement(streamTopics);
  }

  if (kind === "group") {
    return faker.helpers.arrayElement(streamGroups);
  }

  return faker.helpers.arrayElement(streamIdeas);
};

export const createStreamMockItems = (
  count = 20,
): Array<StreamItemProps & { id: string }> =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    avatarUrl: undefined,
    title: compactTitle(),
    description: compactDescription(),
    lastUpdated: faker.date.recent({ days: 15 }),
  }));
