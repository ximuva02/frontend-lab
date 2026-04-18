const BLOCK_TYPES = {
  paragraph: "Text",
  heading: "Heading",
  bullet: "Bullet List",
  numbered: "Numbered List",
  quote: "Quote",
  code: "Code Block",
  divider: "Divider",
  todo: "Todo",
};

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `block-${Math.random().toString(36).slice(2, 10)}`;
};

function createBlock(type, content = "", meta = {}) {
  return {
    id: createId(),
    type,
    content,
    ...meta,
  };
}

function normalizeLines(markdown) {
  return String(markdown || "")
    .replace(/\r\n/g, "\n")
    .split("\n");
}

function flushParagraph(buffer, blocks) {
  if (!buffer.length) {
    return;
  }

  blocks.push(createBlock("paragraph", buffer.join("\n").trimEnd()));
  buffer.length = 0;
}

export function parseMarkdownToBlocks(markdown) {
  const lines = normalizeLines(markdown);
  const blocks = [];
  const paragraphBuffer = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^```/.test(trimmed)) {
      flushParagraph(paragraphBuffer, blocks);

      const language = trimmed.slice(3).trim();
      const codeLines = [];
      index += 1;

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(createBlock("code", codeLines.join("\n"), { language }));
      continue;
    }

    if (trimmed === "---") {
      flushParagraph(paragraphBuffer, blocks);
      blocks.push(createBlock("divider"));
      continue;
    }

    if (/^#\s+/.test(trimmed)) {
      flushParagraph(paragraphBuffer, blocks);
      blocks.push(createBlock("heading", trimmed.replace(/^#\s+/, "")));
      continue;
    }

    if (/^- \[( |x)\]\s+/.test(trimmed)) {
      flushParagraph(paragraphBuffer, blocks);
      const checked = /^- \[x\]\s+/i.test(trimmed);
      blocks.push(
        createBlock("todo", trimmed.replace(/^- \[( |x)\]\s+/i, ""), {
          checked,
        }),
      );
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph(paragraphBuffer, blocks);
      blocks.push(createBlock("bullet", trimmed.replace(/^-\s+/, "")));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph(paragraphBuffer, blocks);
      blocks.push(createBlock("numbered", trimmed.replace(/^\d+\.\s+/, "")));
      continue;
    }

    if (/^>\s+/.test(trimmed)) {
      flushParagraph(paragraphBuffer, blocks);
      blocks.push(createBlock("quote", trimmed.replace(/^>\s+/, "")));
      continue;
    }

    if (!trimmed) {
      flushParagraph(paragraphBuffer, blocks);
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph(paragraphBuffer, blocks);

  return blocks.length ? blocks : [createBlock("paragraph", "")];
}

function serializeBlock(block, index) {
  switch (block.type) {
    case "heading":
      return `# ${block.content}`.trimEnd();
    case "bullet":
      return `- ${block.content}`.trimEnd();
    case "numbered":
      return `${index + 1}. ${block.content}`.trimEnd();
    case "quote":
      return `> ${block.content}`.trimEnd();
    case "code":
      return `\`\`\`${block.language || ""}\n${block.content || ""}\n\`\`\``;
    case "divider":
      return "---";
    case "todo":
      return `- [${block.checked ? "x" : " "}] ${block.content}`.trimEnd();
    case "paragraph":
    default:
      return String(block.content || "").trimEnd();
  }
}

export function serializeBlocksToMarkdown(blocks) {
  return blocks
    .map((block, index) => serializeBlock(block, index))
    .filter((block) => block !== "")
    .join("\n\n")
    .trim();
}

export function createEmptyBlock(type = "paragraph") {
  return createBlock(type, "", type === "todo" ? { checked: false } : {});
}

export function getBlockTypeLabel(type) {
  return BLOCK_TYPES[type] || "Text";
}

export const slashCommands = [
  {
    id: "paragraph",
    label: "Text",
    description: "Standardabsatz fuer freien Text.",
    type: "paragraph",
  },
  {
    id: "heading",
    label: "Heading",
    description: "Grosse Abschnittsueberschrift.",
    type: "heading",
  },
  {
    id: "bullet",
    label: "Bullet List",
    description: "Punktliste mit einem Eintrag pro Block.",
    type: "bullet",
  },
  {
    id: "numbered",
    label: "Numbered List",
    description: "Nummerierter Listeneintrag.",
    type: "numbered",
  },
  {
    id: "quote",
    label: "Quote",
    description: "Zitat oder hervorgehobener Gedanke.",
    type: "quote",
  },
  {
    id: "code",
    label: "Code Block",
    description: "Mehrzeiliger Code mit optionaler Sprache.",
    type: "code",
  },
  {
    id: "divider",
    label: "Divider",
    description: "Visuelle Trennlinie.",
    type: "divider",
  },
  {
    id: "todo",
    label: "Todo",
    description: "Checkbox fuer offene Aufgaben.",
    type: "todo",
  },
];
