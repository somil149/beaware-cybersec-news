import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads without errors
    await expect(page).toHaveTitle(/BeAware/);
    
    // Check if main elements are present
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display search bar', async ({ page }) => {
    await page.goto('/');
    
    // Check if search input is present
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    // Check if search button is present
    const searchButton = page.locator('button:has-text("Search")');
    await expect(searchButton).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    await page.goto('/');
    
    // Check if category filter section is present
    await expect(page.locator('text=Filter by Category')).toBeVisible();
  });

  test('should display time filters', async ({ page }) => {
    await page.goto('/');
    
    // Check if time filter section is present
    await expect(page.locator('text=Filter by Time')).toBeVisible();
  });

  test('should display newsletter signup', async ({ page }) => {
    await page.goto('/');
    
    // Check if newsletter signup section is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});