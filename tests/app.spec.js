import { test, expect } from '@playwright/test';



test.describe('Live Edit Text Application', () => {
  test.beforeEach(async ({ page }) => {
    // Set a dummy API key in localStorage to prevent settings dialog
    // In mock mode, the API key isn't actually used
    await page.addInitScript(() => {
      localStorage.setItem('editor-storage', JSON.stringify({
        state: { apiKey: 'test-key', history: [] },
        version: 0
      }));
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the main UI elements', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: 'Live Edit' })).toBeVisible();
    
    // Check main textarea
    const textarea = page.getByPlaceholder('Start typing...');
    await expect(textarea).toBeVisible();
    
    // Check buttons
    await expect(page.getByTitle('Clear All Data')).toBeVisible();
    await expect(page.getByTitle('Settings')).toBeVisible();
  });

  test('should process text and show suggestion', async ({ page }) => {
    // Disable auto-process for this test
    const autoProcessLabel = page.locator('label:has-text("Auto-process")');
    const autoProcessCheckbox = autoProcessLabel.locator('input[type="checkbox"]');
    await autoProcessCheckbox.uncheck();
    
    // Type in the main input
    const textarea = page.getByPlaceholder('Start typing...');
    await textarea.fill('hello world');
    
    // Click Process button
    await page.getByRole('button', { name: /process/i }).click();
    
    // Wait for processing to complete (mock AI has 500ms delay)
    await page.waitForTimeout(1000);
    
    // Check that suggestion appears with uppercase text (mock AI)
    // Look for the text in a paragraph element (suggestion card)
    await expect(page.locator('p:has-text("HELLO WORLD")')).toBeVisible();
  });

  test('should promote suggestion to main input', async ({ page }) => {
    // Disable auto-process
    const autoProcessLabel = page.locator('label:has-text("Auto-process")');
    const autoProcessCheckbox = autoProcessLabel.locator('input[type="checkbox"]');
    await autoProcessCheckbox.uncheck();
    
    // Type and process
    const textarea = page.getByPlaceholder('Start typing...');
    await textarea.fill('test text');
    await page.getByRole('button', { name: /process/i }).click();
    await page.waitForTimeout(1000);
    
    // Click on the suggestion card to promote (click the paragraph element)
    await page.locator('p:has-text("TEST TEXT")').click();
    
    // Verify the main input now has the uppercase text
    await expect(textarea).toHaveValue('TEST TEXT');
    
    // Verify history section appears with original text
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
  });

  test('should toggle auto-processing', async ({ page }) => {
    // Find the auto-process checkbox
    const autoProcessLabel = page.locator('label:has-text("Auto-process")');
    const autoProcessCheckbox = autoProcessLabel.locator('input[type="checkbox"]');
    
    // Verify it's checked by default
    await expect(autoProcessCheckbox).toBeChecked();
    
    // Uncheck it
    await autoProcessCheckbox.uncheck();
    await expect(autoProcessCheckbox).not.toBeChecked();
    
    // Check it again
    await autoProcessCheckbox.check();
    await expect(autoProcessCheckbox).toBeChecked();
  });

  test('should clear all data', async ({ page }) => {
    // Disable auto-process
    const autoProcessLabel = page.locator('label:has-text("Auto-process")');
    const autoProcessCheckbox = autoProcessLabel.locator('input[type="checkbox"]');
    await autoProcessCheckbox.uncheck();
    
    const textarea = page.getByPlaceholder('Start typing...');
    
    // Create some data
    await textarea.fill('data to clear');
    await page.getByRole('button', { name: /process/i }).click();
    await page.waitForTimeout(1000);
    await page.locator('p:has-text("DATA TO CLEAR")').click();
    
    // Verify history exists
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
    
    // Setup dialog handler before clicking
    page.once('dialog', dialog => {
      expect(dialog.message()).toContain('clear all history');
      dialog.accept();
    });
    
    // Click clear button
    await page.getByTitle('Clear All Data').click();
    
    // Wait for state to update
    await page.waitForTimeout(500);
    
    // Verify input is cleared
    await expect(textarea).toHaveValue('');
    
    // Verify history is gone
    await expect(page.getByRole('heading', { name: 'History' })).not.toBeVisible();
  });

  test('should handle guidance input', async ({ page }) => {
    // Disable auto-process
    const autoProcessLabel = page.locator('label:has-text("Auto-process")');
    const autoProcessCheckbox = autoProcessLabel.locator('input[type="checkbox"]');
    await autoProcessCheckbox.uncheck();
    
    const textarea = page.getByPlaceholder('Start typing...');
    const guidanceInput = page.getByPlaceholder(/guidance/i);
    
    // Type text and guidance
    await textarea.fill('test');
    await guidanceInput.fill('make it uppercase');
    
    // Process
    await page.getByRole('button', { name: /process/i }).click();
    await page.waitForTimeout(1000);
    
    // Verify suggestion appears (mock AI ignores guidance but still processes)
    // Look for TEST in a paragraph element (not the textarea)
    await expect(page.locator('p:has-text("TEST")').first()).toBeVisible();
  });
  test('should restore text from history', async ({ page }) => {
    // Disable auto-process
    const autoProcessLabel = page.locator('label:has-text("Auto-process")');
    const autoProcessCheckbox = autoProcessLabel.locator('input[type="checkbox"]');
    await autoProcessCheckbox.uncheck();
    
    const textarea = page.getByPlaceholder('Start typing...');
    
    // Create history by processing and promoting
    await textarea.fill('first version');
    await page.getByRole('button', { name: /process/i }).click();
    await page.waitForTimeout(1000);
    
    // Promote to history
    await page.locator('p:has-text("FIRST VERSION")').click();
    
    // Type new text
    await textarea.fill('second version');
    
    // Restore from history
    // Find the history item with "first version" and click its Restore button
    // Filter by "Restore" to distinguish from suggestion card
    const historyItem = page.locator('.group').filter({ hasText: 'Restore' }).filter({ hasText: 'first version' });
    await historyItem.hover();
    await page.getByRole('button', { name: 'Restore' }).first().click();
    
    // Verify text is restored
    await expect(textarea).toHaveValue('first version');
  });
});
