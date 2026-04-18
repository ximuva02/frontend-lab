import { html, useEffect, useMemo, useRef, useState } from "../runtime.js";
import {
  createEmptyBlock,
  parseMarkdownToBlocks,
  serializeBlocksToMarkdown,
} from "../block-adapter.js";
import { BlockCard } from "./BlockCard.js";
import { getFilteredCommands } from "./SlashMenu.js";

export function BlockEditorView({ document, onDocumentChange }) {
  const initialBlocks = useMemo(() => parseMarkdownToBlocks(document), []);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [activeBlockId, setActiveBlockId] = useState(
    () => initialBlocks[0]?.id || null,
  );
  const [slashState, setSlashState] = useState({
    blockId: null,
    query: "",
    activeIndex: 0,
  });
  const [drafts, setDrafts] = useState({});
  const lastSerializedDocumentRef = useRef(document);

  useEffect(() => {
    if (document === lastSerializedDocumentRef.current) {
      return;
    }

    const parsedBlocks = parseMarkdownToBlocks(document);
    setBlocks(parsedBlocks);
    setDrafts({});
    setSlashState({ blockId: null, query: "", activeIndex: 0 });
    setActiveBlockId((currentId) => {
      const matchingBlock = parsedBlocks.find(
        (block) => block.id === currentId,
      );
      return matchingBlock ? currentId : parsedBlocks[0]?.id || null;
    });
  }, [document]);

  const filteredCommands = useMemo(
    () => getFilteredCommands(slashState.query),
    [slashState.query],
  );

  const closeSlashMenu = () => {
    setSlashState({ blockId: null, query: "", activeIndex: 0 });
  };

  const clearDraft = (blockId) => {
    setDrafts((currentDrafts) => {
      if (!(blockId in currentDrafts)) {
        return currentDrafts;
      }

      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[blockId];
      return nextDrafts;
    });
  };

  const applyBlocks = (
    nextBlocks,
    statusMessage = "Blockmodus aktualisiert.",
  ) => {
    const sanitizedBlocks = nextBlocks.length
      ? nextBlocks
      : [createEmptyBlock()];
    const nextDocument = serializeBlocksToMarkdown(sanitizedBlocks);

    lastSerializedDocumentRef.current = nextDocument;
    setBlocks(sanitizedBlocks);
    onDocumentChange(nextDocument, statusMessage);
  };

  const updateBlock = (
    blockId,
    updater,
    statusMessage = "Block aktualisiert.",
  ) => {
    const nextBlocks = blocks.map((block) => {
      if (block.id !== blockId) {
        return block;
      }

      return typeof updater === "function"
        ? updater(block)
        : { ...block, ...updater };
    });

    applyBlocks(nextBlocks, statusMessage);
  };

  const insertBlockAfter = (blockId) => {
    const currentIndex = blocks.findIndex((block) => block.id === blockId);
    const nextBlock = createEmptyBlock();
    const nextBlocks = [...blocks];

    nextBlocks.splice(currentIndex + 1, 0, nextBlock);
    applyBlocks(nextBlocks, "Neuer Block eingefuegt.");
    setActiveBlockId(nextBlock.id);
    closeSlashMenu();
  };

  const insertBlockAtEnd = () => {
    const lastBlock = blocks[blocks.length - 1];

    if (lastBlock) {
      insertBlockAfter(lastBlock.id);
      return;
    }

    const nextBlock = createEmptyBlock();
    applyBlocks([nextBlock], "Neuer Block eingefuegt.");
    setActiveBlockId(nextBlock.id);
  };

  const openSlashMenu = (blockId, query) => {
    setSlashState({ blockId, query, activeIndex: 0 });
  };

  const applySlashCommand = (blockId, command) => {
    const label = command.label || command.type;
    const nextBlocks = blocks.map((block) => {
      if (block.id !== blockId) {
        return block;
      }

      const nextBlock = {
        ...block,
        type: command.type,
        content: command.type === "divider" ? "" : block.content,
      };

      if (command.type === "todo") {
        nextBlock.checked = Boolean(block.checked);
      } else {
        delete nextBlock.checked;
      }

      if (command.type === "code") {
        nextBlock.language = block.language || "txt";
      } else {
        delete nextBlock.language;
      }

      return nextBlock;
    });

    clearDraft(blockId);
    closeSlashMenu();
    applyBlocks(nextBlocks, `${label} eingefuegt.`);
    setActiveBlockId(blockId);
  };

  const handleBlockKeyDown = (event, block) => {
    const currentIndex = blocks.findIndex((entry) => entry.id === block.id);

    if (slashState.blockId === block.id && filteredCommands.length) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSlashState((currentState) => ({
          ...currentState,
          activeIndex: Math.min(
            currentState.activeIndex + 1,
            filteredCommands.length - 1,
          ),
        }));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSlashState((currentState) => ({
          ...currentState,
          activeIndex: Math.max(currentState.activeIndex - 1, 0),
        }));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        applySlashCommand(
          block.id,
          filteredCommands[slashState.activeIndex] || filteredCommands[0],
        );
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        clearDraft(block.id);
        closeSlashMenu();
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey && block.type !== "code") {
      event.preventDefault();
      insertBlockAfter(block.id);
      return;
    }

    if (
      event.key === "Backspace" &&
      !block.content &&
      !drafts[block.id] &&
      blocks.length > 1
    ) {
      event.preventDefault();
      const nextBlocks = blocks.filter((entry) => entry.id !== block.id);
      const nextFocusBlock =
        nextBlocks[Math.max(currentIndex - 1, 0)] || nextBlocks[0];

      applyBlocks(nextBlocks, "Leerer Block entfernt.");
      setActiveBlockId(nextFocusBlock?.id || null);
      closeSlashMenu();
    }
  };

  const handleBlockInput = (blockId, value, block) => {
    const isSlashCommandInput =
      block.content.trim() === "" && value.startsWith("/");

    if (isSlashCommandInput) {
      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [blockId]: value,
      }));
      openSlashMenu(blockId, value.slice(1));
      return;
    }

    clearDraft(blockId);

    if (slashState.blockId === blockId) {
      closeSlashMenu();
    }

    updateBlock(
      blockId,
      (currentBlock) => ({
        ...currentBlock,
        content: value,
      }),
      "Blockinhalt aktualisiert.",
    );
  };

  return html`
    <div className="editor-stack">
      <p className="editor-hint">
        Sichtbar funktioniert jetzt beides: Enter erstellt einen neuen Block,
        oder du klickst auf "Block darunter einfuegen". Slash-Commands oeffnest
        du, indem du in einem leeren Block / tippst.
      </p>
      <div className="block-list">
        ${blocks.map(
          (block, index) => html`
            <${BlockCard}
              key=${block.id}
              block=${block}
              index=${index}
              inputValue=${drafts[block.id] ?? block.content}
              isActive=${activeBlockId === block.id}
              isSlashOpen=${slashState.blockId === block.id}
              slashQuery=${slashState.query}
              slashIndex=${slashState.activeIndex}
              onFocus=${() => setActiveBlockId(block.id)}
              onChange=${(value, currentBlock) =>
                handleBlockInput(block.id, value, currentBlock)}
              onKeyDown=${handleBlockKeyDown}
              onToggleTodo=${(checked) =>
                updateBlock(
                  block.id,
                  { checked },
                  checked ? "Todo abgehakt." : "Todo geoeffnet.",
                )}
              onSlashSelect=${(command) => applySlashCommand(block.id, command)}
              onInsertAfter=${() => insertBlockAfter(block.id)}
            />
          `,
        )}
      </div>
      <div className="block-editor-actions">
        <button className="button" type="button" onClick=${insertBlockAtEnd}>
          Neuen Block am Ende einfuegen
        </button>
      </div>
    </div>
  `;
}
