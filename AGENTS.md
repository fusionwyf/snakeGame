# AGENTS.md - Snake Game Repository Guidelines for AI Coding Agents

This document defines all standards, conventions, and workflows for AI agents working on this snake game project. Follow these rules strictly to ensure code consistency and quality.

---

## 1. Project Overview

- **Project**: Classic snake game implementation
- **Tech Stack**: Vanilla TypeScript, Vite (build tool), Vitest (testing framework), ESLint (linting), Prettier (formatting)
- **Target**: Browser-based, lightweight, no heavy dependencies
- **Core Goals**: High performance, responsive controls, clean UI, cross-browser compatibility

---

## 2. Core Commands

All commands run from the repository root:

| Command                                | Purpose                                         | Notes                                                                |
| -------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| `npm install`                          | Install all dependencies                        | Run first when setting up the project                                |
| `npm run dev`                          | Start local development server                  | Runs on http://localhost:5173 by default, hot reload enabled         |
| `npm run build`                        | Production build                                | Outputs to `dist/` directory, type checks before build               |
| `npm run preview`                      | Preview production build locally                | Requires build to be run first                                       |
| `npm run lint`                         | Run ESLint on all TypeScript files              | Fixes auto-fixable issues automatically                              |
| `npm run lint:check`                   | Dry run lint, only report issues without fixing | Used in CI checks                                                    |
| `npm run test`                         | Run full test suite                             | Runs all unit and integration tests                                  |
| `npm run test:watch`                   | Run tests in watch mode                         | Re-runs tests when files change                                      |
| `npm run test:single <test-file-path>` | Run single test file                            | Example: `npm run test:single src/utils/__tests__/collision.test.ts` |
| `npm run test:coverage`                | Generate test coverage report                   | Outputs to `coverage/` directory, requires minimum 80% coverage      |
| `npm run format`                       | Format all files with Prettier                  | Auto-fixes formatting issues                                         |
| `npm run format:check`                 | Check formatting without making changes         | Used in CI checks                                                    |

---

## 3. Code Style Guidelines

### 3.1 General Rules

- All source code lives in the `src/` directory
- Use TypeScript for all code, no plain JavaScript files allowed
- All files must end with a newline
- No trailing whitespace at end of lines
- Maximum line length: 120 characters

### 3.2 Imports

- Group imports in this order:
  1. External dependencies (e.g. `import { vi } from 'vitest'`)
  2. Internal absolute imports (use `@/` alias for src directory: `import { Snake } from '@/entities/Snake'`)
  3. Internal relative imports (e.g. `import { checkCollision } from './collision'`)
- Add a blank line between import groups
- Use default exports for component/entity files, named exports for utility/helper files
- Avoid wildcard imports (`import * as utils from './utils'`) unless explicitly necessary

### 3.3 Formatting

- Use Prettier defaults with these overrides:
  - Tab width: 2 spaces
  - Semicolons: Always required
  - Quotes: Single quotes for strings, double quotes for JSX attributes
  - Trailing commas: ES5 (trailing commas in arrays, objects, function parameters)
- Run `npm run format` before committing any code

### 3.4 TypeScript Rules

- Enable strict mode (already configured in `tsconfig.json`)
- No `any` type allowed, use unknown instead and properly type narrow
- No `@ts-ignore` or `@ts-expect-error` unless absolutely necessary, add a comment explaining why if used
- All functions must have explicit return types
- All function parameters must have explicit types
- Use interfaces for object type definitions, type aliases for unions/intersections
- Prefer `const` over `let`, never use `var`
- Use type guards for runtime type checking

### 3.5 Naming Conventions

- **Files**: Use kebab-case (e.g. `snake-controller.ts`, `collision-utils.ts`)
- **Classes/Interfaces/Types**: Use PascalCase (e.g. `Snake`, `GameState`, `Position`)
- **Functions/Variables/Constants**: Use camelCase (e.g. `moveSnake()`, `gameScore`, `MAX_SNAKE_SPEED`)
- **Constants**: Use UPPER_SNAKE_CASE for values that never change (e.g. `GRID_SIZE = 20`, `INITIAL_SNAKE_LENGTH = 3`)
- **Boolean variables**: Prefix with `is`, `has`, `should`, `can` (e.g. `isGameOver`, `hasCollided`, `shouldPause`)
- **Event handlers**: Prefix with `handle` (e.g. `handleKeyPress()`, `handleGameReset()`)

### 3.6 Error Handling

- Always handle errors properly, no empty `catch` blocks
- Use custom error classes for game-specific errors (e.g. `InvalidMoveError`, `GameNotInitializedError`)
- Log errors with context for debugging, never expose internal error details to end users
- Validate all user input before processing
- Prefer early return pattern over nested if/else statements

### 3.7 Comments

- Write self-documenting code first, only add comments to explain "why" not "what"
- Use JSDoc comments for all public functions/classes to explain purpose, parameters, return values, and possible exceptions
- Remove commented out code before committing, use git history instead
- No TODO comments without an associated issue number and assignee

---

## 4. Cursor Rules (`.cursor/rules/`)

These rules apply to Cursor IDE AI assistants:

1. Always follow the code style guidelines defined in this document
2. Run type checks, lint, and tests before suggesting any code changes
3. Prioritize performance for game logic, avoid unnecessary computations in the game loop
4. Use browser-native APIs where possible, avoid adding unnecessary dependencies
5. When fixing bugs, write a test case that reproduces the bug first before implementing the fix
6. Suggest accessibility improvements where possible (keyboard navigation, screen reader support)
7. Never suggest code that violates TypeScript strict mode rules

---

## 5. Copilot Instructions (`.github/copilot-instructions.md`)

1. All code suggestions must follow the project's code style conventions
2. Prefer modern, performant JavaScript/TypeScript features
3. Always include type annotations for all new code
4. Write tests for all new functionality you suggest
5. Avoid suggesting deprecated browser APIs
6. Prioritize code readability and maintainability over overly clever one-liners
7. When suggesting refactors, explain the benefit of the refactor clearly

---

## 6. Implementation Best Practices

- Keep game logic separate from rendering logic for better testability
- The game loop should run at 60fps, use `requestAnimationFrame`
- All game state should be immutable, update state using pure functions where possible
- Handle window resizing properly, maintain aspect ratio of the game canvas
- Support keyboard controls (arrow keys, WASD) by default
- Add touch support for mobile devices
- Ensure the game works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Keep bundle size as small as possible, avoid adding heavy dependencies

---

## 7. Testing Guidelines

- Write unit tests for all utility functions and game logic
- Write integration tests for core game flows (start game, move snake, collide, game over)
- Mock browser APIs in unit tests
- Test edge cases: snake hitting wall, snake hitting itself, eating food, maximum score
- All new features must have corresponding test coverage
- Avoid flaky tests, make tests deterministic

---

## 8. Commit Message Conventions

Follow Conventional Commits format for all commit messages:

```
<type>(<scope>): <description>

[optional body]
```

- **Types**: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor` (code change no feature/bug fix), `test` (add tests), `chore` (build/tooling changes)
- **Scope**: The area of the codebase affected (e.g. `game-logic`, `ui`, `tests`)
- **Description**: Short, concise summary of the change in present tense
