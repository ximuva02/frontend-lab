import { html, useEffect, useRef } from "../runtime.js";
import { getBlockTypeLabel, slashCommands } from "../block-adapter.js";
import { classNames } from "../utils/class-names.js";
import { normalizeTextareaHeight } from "../utils/textarea.js";
import { SlashMenu } from "./SlashMenu.js";

const paragraphCommand = slashCommands.find(
  (command) => command.type === "paragraph",
);

export function BlockCard({
  block,
  index,
  inputValue,
  isActive,
  isSlashOpen,
  slashQuery,
  slashIndex,
  onFocus,
  onChange,
  onKeyDown,
  onToggleTodo,
  onSlashSelect,
  onInsertAfter,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    normalizeTextareaHeight(inputRef.current);
  }, [inputValue, block.type]);

  useEffect(() => {
    if (!isActive || !inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, [isActive]);

  if (block.type === "divider") {
    return html`
      <article
        className=${classNames("block-card", isActive && "block-card-active")}
      >
        <div className="block-meta">
          <span>${getBlockTypeLabel(block.type)}</span>
          <button
            className="button"
            type="button"
            onClick=${() => onSlashSelect(paragraphCommand)}
          >
            In Text umwandeln
          </button>
        </div>
        <hr className="block-divider" />
        <div className="block-footer">
          <button
            className="block-insert-button"
            type="button"
            onClick=${onInsertAfter}
          >
            Block darunter einfuegen
          </button>
        </div>
      </article>
    `;
  }

  const inputClassName = classNames(
    "block-input",
    block.type === "heading" && "block-input-heading",
    block.type === "quote" && "block-input-quote",
    block.type === "bullet" && "block-input-list",
    block.type === "numbered" && "block-input-numbered",
    block.type === "todo" && "block-input-todo",
  );

  return html`
    <article
      className=${classNames("block-card", isActive && "block-card-active")}
    >
      <div className="block-meta">
        <span>${getBlockTypeLabel(block.type)}</span>
        ${block.type === "todo"
          ? html`
              <label>
                <input
                  type="checkbox"
                  checked=${Boolean(block.checked)}
                  onChange=${(event) => onToggleTodo(event.target.checked)}
                />
                Erledigt
              </label>
            `
          : html`<span>Block ${index + 1}</span>`}
      </div>

      ${(block.type === "bullet" ||
        block.type === "numbered" ||
        block.type === "todo") &&
      html`<span className="block-list-symbol"
        >${block.type === "numbered"
          ? `${index + 1}.`
          : block.type === "todo"
            ? Boolean(block.checked)
              ? "x"
              : "□"
            : "•"}</span
      >`}
      ${block.type === "code"
        ? html`
            <textarea
              ref=${inputRef}
              className="block-code"
              value=${inputValue}
              onFocus=${onFocus}
              onInput=${(event) => {
                normalizeTextareaHeight(event.target);
                onChange(event.target.value, block);
              }}
              onKeyDown=${(event) => onKeyDown(event, block)}
              spellcheck=${false}
              placeholder="Code eingeben"
            ></textarea>
          `
        : html`
            <textarea
              ref=${inputRef}
              className=${inputClassName}
              value=${inputValue}
              onFocus=${onFocus}
              onInput=${(event) => {
                normalizeTextareaHeight(event.target);
                onChange(event.target.value, block);
              }}
              onKeyDown=${(event) => onKeyDown(event, block)}
              rows=${1}
              spellcheck=${false}
              placeholder=${block.type === "heading"
                ? "Titel eingeben"
                : "Text eingeben oder / fuer Kommandos"}
            ></textarea>
          `}
      ${isSlashOpen &&
      html`<${SlashMenu}
        query=${slashQuery}
        activeIndex=${slashIndex}
        onSelect=${onSlashSelect}
      />`}

      <div className="block-footer">
        <button
          className="block-insert-button"
          type="button"
          onClick=${onInsertAfter}
        >
          Block darunter einfuegen
        </button>
      </div>
    </article>
  `;
}
