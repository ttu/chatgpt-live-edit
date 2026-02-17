# ChatGPT Live Edit

A real-time text editing application with AI assistance, history tracking, and suggestion management. Built with React 19, Vite, and Tailwind CSS 4.

## Features

- **AI-Powered Text Editing**: Get AI suggestions to improve your text based on custom guidance
- **Real-time Processing**: Auto-process text every 3 seconds or manually trigger processing
- **History Tracking**: Keep track of previous versions and restore them with one click
- **Keyboard Shortcuts**: Fast navigation with keyboard shortcuts
- **Local Storage**: Your API key and history are stored locally in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

3. **Configure API Key**:
   - Open the app in your browser (usually `http://localhost:5173`)
   - Click the Settings icon (⚙️) in the top right
   - Enter your OpenAI API key
   - Your key is stored locally and never sent to our servers

4. **Start Editing**:
   - Type your text in the main textarea
   - Optionally add guidance (e.g., "Make it more professional")
   - Press `Cmd/Ctrl + Enter` to process or enable auto-process

## Keyboard Shortcuts

- **`Cmd/Ctrl + Enter`**: Process text to get AI suggestions
- **`Cmd/Ctrl + ArrowUp`**: Promote current suggestion to main input
- **`Cmd/Ctrl + ArrowDown`**: Restore most recent item from history

## Default Guidance

If you leave the guidance field empty, the app uses **"Korjaa kieliasu ja paranna tekstin sujuvuutta pitäen alkuperäinen sävy"** (Fix language style and improve text flow while keeping the original tone) as the default guidance for AI processing. A language selector will be added in the future.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run tests with UI mode
- `npm run test:e2e:headed` - Run tests in headed mode

### Testing

The project uses Playwright for end-to-end testing. Tests are located in the `tests/` directory.

## Deployment (GitHub Pages)

The app deploys automatically to GitHub Pages on push to `main`.

**One-time setup**: In your repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site will be available at `https://<username>.github.io/chatgpt-live-edit/`.

## Architecture & Guidelines

- **Architecture**: See [AGENTS.md](./AGENTS.md#architecture) for detailed architecture documentation
- **AI Agent Rules**: See [AGENTS.md](./AGENTS.md) for coding guidelines and best practices

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling with semantic color tokens
- **Zustand** - State management with persistence
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Playwright** - E2E testing
- **OpenAI API** - AI text processing (gpt-5.2)
