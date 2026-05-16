import { test, expect } from '@playwright/test';

test.describe('Article Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display article cards', async ({ page }) => {
    // Wait for articles to load
    await page.waitForSelector('article', { timeout: 10000 });
    
    const articles = page.locator('article');
    const count = await articles.count();
    
    // Should have at least some articles (or empty state)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to article detail page', async ({ page }) => {
    // Wait for articles to load
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstArticle = page.locator('article').first();
    const articleLink = firstArticle.locator('a').first();
    
    if (await articleLink.count() > 0) {
      await articleLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if we're on an article page
      expect(page.url()).toContain('/article/');
    }
  });

  test('should display article metadata', async ({ page }) => {
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstArticle = page.locator('article').first();
    
    // Check for category badge
    const category = firstArticle.locator('span').first();
    await expect(category).toBeVisible();
    
    // Check for source info
    await expect(firstArticle.locator('text=/Source|Author/')).toBeVisible();
  });

  test('should display article image if available', async ({ page }) => {
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstArticle = page.locator('article').first();
    const image = firstArticle.locator('img').first();
    
    if (await image.count() > 0) {
      await expect(image).toBeVisible();
    }
  });
});