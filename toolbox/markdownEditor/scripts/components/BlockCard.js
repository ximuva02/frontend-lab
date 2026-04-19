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

  const chrome = html`
    <div className="block-row-chrome">
      <span className="block-row-type">${getBlockTypeLabel(block.type)}</span>
      ${block.type === "divider"
        ? html`
            <button
              className="block-row-action"
              type="button"
              onClick=${() => onSlashSelect(paragraphCommand)}
            >
              In Text umwandeln
            </button>
          `
        : null}
      <button
        className="block-row-action block-insert-button"
        type="button"
        onClick=${onInsertAfter}
        aria-label="Block darunter einfuegen"
        title="Block darunter einfuegen"
      >
        +
      </button>
    </div>
  `;

  if (block.type === "divider") {
    return html`
      <article
        className=${classNames("block-row", isActive && "block-row-active")}
        data-block-type=${block.type}
      >
        ${chrome}
        <div className="block-row-body">
          <hr className="block-divider" />
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

  const isListBlock =
    block.type === "bullet" || block.type === "numbered" || block.type === "todo";

  const listMarker =
    block.type === "numbered"
      ? `${index + 1}.`
      : block.type === "todo"
        ? null
        : "•";

  return html`
    <article
      className=${classNames("block-row", isActive && "block-row-active")}
      data-block-type=${block.type}
    >
      ${chrome}
      <div
        className=${classNames(
          "block-row-body",
          isListBlock && "block-row-body-list",
        )}
      >
        ${isListBlock &&
        html`${block.type === "todo"
          ? html`
              <input
                className="block-todo-checkbox"
                type="checkbox"
                checked=${Boolean(block.checked)}
                onFocus=${onFocus}
                onChange=${(event) => onToggleTodo(event.target.checked)}
                aria-label="Todo erledigt"
                title="Todo erledigt"
              />
            `
          : html`<span className="block-list-symbol">${listMarker}</span>`}`}
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
      </div>
      ${isSlashOpen &&
      html`<${SlashMenu}
        query=${slashQuery}
        activeIndex=${slashIndex}
        onSelect=${onSlashSelect}
      />`}
    </article>
  `;
}
