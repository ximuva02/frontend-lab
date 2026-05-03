type SelectionBounds = {
  selectionStart: number;
  selectionEnd: number;
};

type NextEditState = {
  nextValue: string;
  nextCaretOffset: number;
};

type LineContext = {
  lineStart: number;
  boundedLineEnd: number;
  currentLine: string;
};

const getLineContext = (value: string, caretOffset: number): LineContext => {
  const lineStart = value.lastIndexOf("\n", Math.max(0, caretOffset - 1)) + 1;
  const lineEnd = value.indexOf("\n", caretOffset);
  const boundedLineEnd = lineEnd === -1 ? value.length : lineEnd;

  return {
    lineStart,
    boundedLineEnd,
    currentLine: value.slice(lineStart, boundedLineEnd),
  };
};

const getContinuationPrefix = (line: string) => {
  if (/^•\s/.test(line)) {
    return "• ";
  }

  if (/^☐\s/.test(line)) {
    return "☐ ";
  }

  const orderedMatch = line.match(/^(\d+)\.\s/);
  if (orderedMatch) {
    return `${Number(orderedMatch[1]) + 1}. `;
  }

  // Headlines don't continue automatically
  return "";
};

const getListPrefixLength = (line: string) => {
  if (/^•\s/.test(line)) {
    return 2;
  }

  if (/^☐\s/.test(line)) {
    return 2;
  }

  const orderedMatch = line.match(/^\d+\.\s/);
  if (orderedMatch) {
    return orderedMatch[0].length;
  }

  const headlineMatch = line.match(/^#{1,6}\s/);
  if (headlineMatch) {
    return headlineMatch[0].length;
  }

  return 0;
};

const stripListPrefix = (line: string) =>
  line
    .replace(/^•\s/, "")
    .replace(/^☐\s/, "")
    .replace(/^\d+\.\s/, "")
    .replace(/^#{1,6}\s/, "");

export const normalizeStructuredText = (rawText: string) => {
  const lines = rawText.replaceAll("\r", "").split("\n");
  const normalizedLines: string[] = [];
  let orderedIndex = 1;

  for (const line of lines) {
    const bulletMatch = line.match(/^\*\s?(.*)$/);
    if (bulletMatch) {
      normalizedLines.push(`• ${bulletMatch[1]}`);
      orderedIndex = 1;
      continue;
    }

    const todoMatch = line.match(/^\+\s?(.*)$/);
    if (todoMatch) {
      normalizedLines.push(`☐ ${todoMatch[1]}`);
      orderedIndex = 1;
      continue;
    }

    const headlineMatch = line.match(/^(#{1,6})\s?(.*)$/);
    if (headlineMatch) {
      normalizedLines.push(`${headlineMatch[1]} ${headlineMatch[2]}`);
      orderedIndex = 1;
      continue;
    }

    const orderedWithNumber = line.match(/^\d+\.\s?(.*)$/);
    if (orderedWithNumber) {
      normalizedLines.push(`${orderedIndex}. ${orderedWithNumber[1]}`);
      orderedIndex += 1;
      continue;
    }

    normalizedLines.push(line);
    orderedIndex = 1;
  }

  return normalizedLines.join("\n");
};

export const normalizeStructuredTextWithCaret = (
  rawText: string,
  rawCaretOffset: number,
): NextEditState => ({
  nextValue: normalizeStructuredText(rawText),
  nextCaretOffset: normalizeStructuredText(rawText.slice(0, rawCaretOffset))
    .length,
});

export const hasLeadHeadingPattern = (value: string) => {
  const [firstLine = "", secondLine] = value.split("\n");
  return (
    firstLine.trim().length > 0 &&
    secondLine !== undefined &&
    secondLine.trim() === ""
  );
};

export const applyStructuredBackspace = (
  value: string,
  selection: SelectionBounds,
): NextEditState | null => {
  if (selection.selectionStart !== selection.selectionEnd) {
    return null;
  }

  const context = getLineContext(value, selection.selectionStart);
  const listPrefixLength = getListPrefixLength(context.currentLine);
  const isAtMarkerBoundary =
    selection.selectionStart === context.lineStart + listPrefixLength;

  if (listPrefixLength === 0 || !isAtMarkerBoundary) {
    return null;
  }

  return {
    nextValue:
      value.slice(0, context.lineStart) +
      context.currentLine.slice(listPrefixLength) +
      value.slice(context.boundedLineEnd),
    nextCaretOffset: context.lineStart,
  };
};

export const applyStructuredEnter = (
  value: string,
  caretOffset: number,
): NextEditState => {
  const context = getLineContext(value, caretOffset);
  const continuationPrefix = getContinuationPrefix(context.currentLine);
  const lineWithoutPrefix = stripListPrefix(context.currentLine).trim();

  if (continuationPrefix && lineWithoutPrefix.length === 0) {
    return {
      nextValue:
        value.slice(0, context.lineStart) + value.slice(context.boundedLineEnd),
      nextCaretOffset: context.lineStart,
    };
  }

  const insertion =
    continuationPrefix && lineWithoutPrefix.length > 0
      ? `\n${continuationPrefix}`
      : "\n";

  const nextRawValue = `${value.slice(0, caretOffset)}${insertion}${value.slice(caretOffset)}`;
  return {
    nextValue: normalizeStructuredText(nextRawValue),
    nextCaretOffset: normalizeStructuredText(
      nextRawValue.slice(0, caretOffset + insertion.length),
    ).length,
  };
};
