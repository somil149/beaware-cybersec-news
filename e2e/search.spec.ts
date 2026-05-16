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
    
    // Wait for navigation or results update
    await page.waitForLoadState('networkidle');
    
    // Check if URL contains search parameter
    expect(page.url()).toContain('search=cybersecurity');
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