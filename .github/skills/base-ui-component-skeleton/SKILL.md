---
name: base-ui-component-skeleton
description: "Create minimal React TypeScript UI component skeletons with CSS Module and basic Storybook story. Use for base component scaffolding, one-folder-per-component structure, grouped subcomponents, Storybook hierarchy, and global theme variables."
argument-hint: "Component name and optional target folder (default: ui-showcase/src)"
user-invocable: true
---

# Base UI Component Skeleton

## When to Use

- Create a new UI component scaffold with minimal files only.
- Create grouped component families where multiple components only make sense together.
- Enforce folder hierarchy and Storybook title hierarchy consistency.

## What to Generate

- React + TypeScript component file
- CSS Module file
- Storybook story file with a minimal default story only

## Required Rules

- One folder per component.
- For grouped component families: one shared parent folder, then one subfolder per component.
- Storybook titles must reflect the same filesystem grouping.
- Use global theme variables from project global CSS where variables exist.
- Component render output must always be a placeholder: `<div>ComponentName</div>`.
- Create only skeleton scaffolding: no business logic, no hooks, no variants, no interaction tests.
- Do not run terminal commands or install dependencies.
- Do not modify unrelated files.

## Procedure

1. Inspect nearby components and stories in the target area for naming and story conventions.
2. If no path is provided, use `ui-showcase/src`.
3. Create folder structure:
   - single component: one component folder
   - grouped components: one parent folder with component subfolders
4. Create the component file with minimal typing and placeholder render output.
5. Create the matching `.module.css` with minimal skeleton classes and theme-variable usage where relevant.
6. Create the `*.stories.tsx` file with only a default story.
7. Set Storybook `title` to expose the group/subgroup hierarchy.
8. Return a concise summary, file tree, story title mapping, assumptions, and optional next steps.

## Output Format

1. Short summary of what was created.
2. File and folder tree with paths.
3. Storybook hierarchy mapping with story titles.
4. Assumptions made (naming and theme-variable availability).
5. Optional follow-ups as numbered suggestions.
