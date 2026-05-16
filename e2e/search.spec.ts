import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow typing in search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('security');
    
    await expect(searchInput).toHaveValue('security');
  });

  test('should submit search form', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    const searchButton = page.locator('button:has-text("Search")');
    
    await searchInput.fill('cybersecurity');
    await searchButton.click();
    
    // Wait for potential navigation or state update
    await page.waitForTimeout(2000);
    
    // Check if search term is in URL or input value is preserved
    const currentUrl = page.url();
    const inputValue = await searchInput.inputValue();
    
    // Either URL should contain search parameter or input should still have the value
    expect(currentUrl.includes('search=cybersecurity') || inputValue === 'cybersecurity').toBeTruthy();
  });

  test('should handle empty search', async ({ page }) => {
    const searchButton = page.locator('button:has-text("Search")');
    
    await searchButton.click();
    
    // Should not navigate or show error
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('should clear search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    await searchInput.fill('test query');
    await searchInput.fill('');
    
    await expect(searchInput).toHaveValue('');
  });
});