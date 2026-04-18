# Markdown Editor Flow Redesign

## Problem

The current block editor works, but it does not feel like a Notion-style writing flow. Blocks are visually presented as separate cards, and inserting new content still feels UI-driven instead of writing-driven. This breaks the sense of continuity the tool is supposed to provide.

## Goal

Redesign the existing block editing experience so it feels like a continuous document:

- block mode is the primary editing experience
- blocks remain the internal editing unit
- editing chrome stays mostly hidden until it is useful
- pressing `Enter` keeps the user writing without requiring button clicks
- existing block types and import/export behavior stay intact

## Scope

### In scope

- make block mode the default landing mode
- redesign block presentation from visible cards to low-chrome document rows
- replace explicit insertion flow with immediate paragraph creation on `Enter`
- keep slash commands as inline block transforms on empty lines
- keep Markdown mode available as a secondary editing mode
- preserve the Markdown string as the canonical document source

### Out of scope

- adding new block types
- expanding import/export features
- replacing the Markdown-string document model
- rewriting the editor around `contenteditable`
- full Notion parity

## Core product decisions

### 1. Continuous writing flow

The block editor should look and feel like a single document, not a collection of widgets. Permanent card borders, visible block containers, and always-on insertion buttons are removed from the primary editing surface.

### 2. Blocks remain the internal model

The implementation keeps the current block-based editing logic and Markdown serialization approach. This is a UX redesign on top of the existing model, not a new editor architecture.

### 3. Slash commands transform the current empty line

Users should begin from a normal empty paragraph line. Typing `/` in that empty line opens the slash menu and transforms that same block into another type such as heading, quote, list, code, divider, or todo.

### 4. Markdown mode stays available

Markdown mode remains in the product for direct source editing and as a fallback for content patterns the block projection does not model cleanly. The redesign should make block mode the obvious primary experience, but not remove the raw Markdown editor.

## UX design

### Default state

- the app opens in block mode
- the editor surface reads as a continuous page
- text rows have minimal visual framing
- subtle handles or type affordances appear only on hover or focus

### Block appearance

- standard text blocks appear as plain document lines
- headings stay visually distinct through typography, not card framing
- quote, list, todo, and code blocks keep only the minimum styling needed for recognition
- divider blocks remain visible as document separators

### Editing behavior

### Enter

When the user presses `Enter` in a non-code block, the editor immediately inserts a new plain text block below the current block and moves focus there. This is the default creation path and replaces reliance on visible add buttons.

### Slash commands

When the current block is empty and the user types `/`, the slash menu opens inline. Choosing a command changes the type of that block instead of creating a separate block first.

### Focus and affordances

- controls stay hidden when the editor is idle
- hover or focus can reveal a lightweight handle, type label, or insertion affordance
- these controls must support discovery without making the layout feel busy

### Empty block handling

- newly created blocks start as plain text
- deleting an empty block with `Backspace` removes it and moves focus predictably to the previous block
- at least one editable block remains available

## Architecture and component design

### Preserved architecture

The Markdown string remains the single source of truth:

`Block editor UI -> block state projection -> Markdown string -> preview`

Markdown mode and block mode continue to edit the same underlying document.

### Component changes

### `App`

- initializes in block mode by default
- keeps mode switching, import, export, sample loading, and status display
- treats Markdown mode as secondary rather than co-primary in the initial experience

### `BlockEditorView`

- becomes the main interaction surface
- manages focus movement, inline slash behavior, insertion on `Enter`, and deletion on `Backspace`
- renders blocks as low-chrome document rows rather than prominent cards

### `BlockCard`

- should be simplified or reshaped into a row-oriented presentation component
- should no longer imply a persistent card container for normal blocks
- can still encapsulate block-specific rendering and interaction hooks

### `SlashMenu`

- stays attached to the currently edited block
- remains an inline transformation menu
- keeps current block-type scope

### `block-adapter`

- keeps the current parse/serialize responsibility
- continues to round-trip the supported block types into Markdown
- is not expanded into a richer document model in this redesign

## Data flow

1. User edits in block mode.
2. The active block interaction updates the projected block list.
3. The projected list serializes back to Markdown immediately.
4. The shared Markdown string updates store state.
5. Preview and Markdown mode reflect the same document.

This preserves the current cross-mode consistency while improving the editor feel.

## Error handling and fallbacks

- import and export error handling remain unchanged
- unsupported Markdown structures remain editable in Markdown mode instead of forcing lossy block interactions
- status feedback continues to surface user-visible actions such as import, export, block transformation, and deletion
- the redesign must not silently discard content when switching between modes

## Testing and validation

Validation should focus on interaction flow rather than new feature breadth:

- block mode is the default initial mode
- pressing `Enter` in a text block creates the next plain text block and moves focus there
- typing `/` in an empty block opens the slash menu and transforms that block
- hover and focus reveal controls without leaving permanent visual chrome behind
- deleting empty blocks keeps focus movement predictable
- existing import/export flow still works
- Markdown and block mode still round-trip the same document
- preview still updates from the shared Markdown source

## Implementation notes

- prefer targeted changes to the existing block editor rather than a rewrite
- reuse the current store, block adapter, and import/export flow
- keep the redesign focused on flow and presentation, not feature expansion

## Success criteria

The redesign is successful when the block editor feels like uninterrupted writing instead of widget manipulation, while preserving the current block scope, Markdown source-of-truth model, and static architecture.
