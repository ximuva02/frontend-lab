import { html, useMemo } from "../runtime.js";
import { slashCommands } from "../block-adapter.js";
import { classNames } from "../utils/class-names.js";

export function getFilteredCommands(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return slashCommands;
  }

  return slashCommands.filter((command) => {
    const haystack = `${command.label} ${command.description}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function SlashMenu({ query, activeIndex, onSelect }) {
  const filteredCommands = useMemo(() => getFilteredCommands(query), [query]);

  if (!filteredCommands.length) {
    return null;
  }

  return html`
    <div className="slash-menu" role="menu" aria-label="Slash Commands">
      <div className="slash-list">
        ${filteredCommands.map(
          (command, index) => html`
            <button
              key=${command.id}
              className=${classNames(
                "slash-action",
                index === activeIndex && "slash-action-active",
              )}
              type="button"
              role="menuitem"
              onMouseDown=${(event) => {
                event.preventDefault();
                onSelect(command);
              }}
            >
              <span className="slash-label">${command.label}</span>
              <span className="slash-description">${command.description}</span>
            </button>
          `,
        )}
      </div>
    </div>
  `;
}
