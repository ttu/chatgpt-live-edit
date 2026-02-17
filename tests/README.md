# Running Tests

This project includes E2E tests using Playwright with a mock OpenAI service.

## Prerequisites

- Node.js and npm installed
- Playwright browsers installed (`npx playwright install chromium`)

## Running Tests

### Important: Stop the Dev Server First

The tests need to start their own dev server with the mock AI environment variable. If you have `npm run dev` running, **stop it first** before running tests.

```bash
# Stop any running dev server (Ctrl+C in the terminal where it's running)

# Then run tests
npm run test:e2e
```

### Test Scripts

- `npm run test:e2e` - Run all tests headlessly
- `npm run test:e2e:ui` - Run tests with Playwright UI (interactive)
- `npm run test:e2e:headed` - Run tests in headed mode (see the browser)

## Mock AI Service

The tests use a mock AI service that simply uppercases the input text. This is controlled by the `VITE_USE_MOCK_AI` environment variable, which is automatically set when running tests.

The mock service:
- Doesn't require an OpenAI API key
- Provides deterministic results (always uppercases)
- Simulates a 500ms API delay
- Allows tests to run quickly and reliably

## Test Coverage

The test suite covers:
- Basic UI rendering
- Text processing and suggestion display
- Suggestion promotion to main input
- Auto-processing toggle
- Clear all data functionality
- Guidance input handling

## Troubleshooting

### Tests fail with "Settings dialog" or "API key" errors

Make sure you've stopped the dev server before running tests. The tests need to start their own server with mock mode enabled.

### Tests timeout

Increase the timeout in `playwright.config.js` or check if the dev server is starting correctly.
