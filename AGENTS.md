# AI Agent Rules

## 1. Role & Context

- **Role Definition**: You are an AI programming assistant focused on concise, context-aware solutions. Act as a thoughtful collaborator, emphasizing clarity and best practices.
- **Maintain Context**: Use information from previous interactions and the current codebase for relevant responses.

## 2. Documentation (Read First!)

Reference `README.md` for project understanding.

- Do not create new documentation file for each new feature. Update existing documentation files.

## 3. Understanding Phase (Before Any Work)

- **Restate Requirements**: Confirm understanding and alignment
- **Identify Challenges**: Highlight edge cases, ambiguities, or potential issues
- **Ask Clarifying Questions**: Address assumptions or missing details
- **Provide References**: Link to documentation sources; never invent solutions

## 4. Planning Phase

- **Plan the Implementation**:
  - Break down into clear, step-by-step changes
  - Justify each step against requirements
  - Identify dependencies and needed features
- **Propose Mock API/UX** (if relevant): Outline affected APIs, UI, or user flows
- **Pause for Complex Tasks**: For non-trivial implementations, wait for explicit approval before coding

## 5. Implementation Phase

- **Use Test-Driven Development (TDD)**:
  - ⚠️ **ALWAYS** write tests FIRST
  - Then implement code to pass tests
  - Then refactor to improve code quality (red-green-refactor)
  - Ensures quality, maintainability, test coverage

- **Write Clean, Readable Code**:
  - Use clear, descriptive names for variables, functions, and classes
  - Keep functions small and focused (single responsibility)
  - Add comments only when "why" isn't obvious from code
  - Prefer self-documenting code over excessive comments

- **Follow Good Practices**:
  - Keep code modular and reusable
  - Avoid duplication (DRY principle)
  - Make dependencies explicit and clear
  - Use pure functions whenever possible (no side effects)
  - Prefer composition over inheritance

- **Handle Errors Properly**:
  - Validate inputs and handle edge cases
  - Use appropriate error handling mechanisms (try-catch, error returns, etc.)
  - Provide clear, actionable error messages
  - Never swallow errors silently

- **Maintain Type Safety** (when applicable):
  - Use strong typing when language supports it
  - Avoid loosely-typed constructs (e.g., `any`, `void*`, untyped dicts)
  - Leverage type inference where appropriate

- **Consider Performance**:
  - Profile before optimizing (avoid premature optimization)
  - Use appropriate data structures and algorithms
  - Cache expensive computations when appropriate
  - Be mindful of memory usage and leaks

- **Security & Validation**:
  - Validate and sanitize all external inputs
  - Follow security best practices for the language/framework
  - Never trust user input
  - Use parameterized queries to prevent injection attacks

- **Be Concise**: Focus only on what's required; avoid unnecessary complexity (YAGNI - You Aren't Gonna Need It)

## 6. Verification Phase

- **Keep Code Clean**: Always format and lint after changes
- **Verify Changes**: Run relevant unit tests after significant updates
- **Update Documentation**:
  - Update `README.md` if necessary.
  - Update `AGENTS.md` with new learnings and best practices

- **Use Semantic Color Tokens**:
  - Always use semantic color tokens from the design system (e.g., `text-destructive`, `bg-warning/10`) instead of hardcoded Tailwind colors
  - Define new semantic colors in `src/index.css` using the `@theme` directive
  - Use opacity modifiers (`/10`, `/20`, `/30`) for backgrounds and borders
  - Ensure proper contrast ratios and dark mode support
  - Example: Use `text-warning-foreground bg-warning/10` instead of `text-red-900 bg-red-50`

- **Keyboard Shortcuts**:
  - Implement global keyboard shortcuts in `EditorLayout` component using `useEffect` with window event listeners
  - Always check if settings dialog is open before triggering shortcuts
  - Consider whether shortcuts should work when textarea/input is focused
  - Provide visual hints for keyboard shortcuts in the UI
  - Current shortcuts:
    - `Cmd/Ctrl + Enter`: Process text
    - `Cmd/Ctrl + ArrowUp`: Promote suggestion
    - `Cmd/Ctrl + ArrowDown`: Restore from history

## Architecture

### Tech Stack

- **Frontend Framework**: React 19 (via Vite)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 with semantic color tokens
- **State Management**: Zustand (with persistence middleware)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Playwright (E2E)
- **Linting**: ESLint

### Application Architecture

The application is a client-side Single Page Application (SPA) that communicates directly with external APIs (OpenAI) from the client browser.

**Key Components:**

- **Editor Store (`useEditorStore.js`)**: Centralized state management using Zustand. Handles input, guidance, suggestions, history, settings, and API interactions. Persists `apiKey` and `history` to `localStorage`.
- **EditorLayout**: Main layout component that orchestrates the UI and handles global keyboard shortcuts.
- **InputArea**: Handles text input, guidance input, and processing triggers.
- **SuggestionCard**: Displays AI-generated suggestions with promote/discard actions.
- **HistoryItem**: Displays history entries with restore functionality.
- **SettingsDialog**: Modal for API key configuration.

### State Management

- **Store**: Zustand store (`useEditorStore`) manages all application state
- **Persistence**: `apiKey` and `history` are persisted to `localStorage` via Zustand's `persist` middleware
- **Actions**:
  - `generateSuggestion()`: Async action that calls OpenAI API
  - `promoteSuggestion()`: Moves suggestion to input and adds current input to history
  - `restoreHistoryItem()`: Restores a history item to input
  - `discardSuggestion()`: Clears current suggestion

### OpenAI Integration

- **Model**: `gpt-5.2`
- **Authentication**: API Key stored in browser `localStorage`
- **Client-Side**: Uses `dangerouslyAllowBrowser: true` for client-side API calls
- **Default Guidance**: "Korjaa kieliasu ja paranna tekstin sujuvuutta pitäen alkuperäinen sävy" (Finnish) when guidance field is empty. Language selector will be added later.
- **Response Processing**: Strips quotes from AI responses automatically

### Security

- **API Key Storage**: Stored in browser `localStorage`, only sent to OpenAI API endpoints
- **Client-Side Requests**: All API calls made directly from client browser
- **No Backend**: No server-side processing; all logic runs client-side
