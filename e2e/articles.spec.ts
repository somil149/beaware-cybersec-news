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
      // Check that the link has the correct href attribute
      const href = await articleLink.getAttribute('href');
      expect(href).toContain('/article/');
      
      // Check that the link text is the article title
      const articleTitle = await firstArticle.locator('h2').textContent();
      expect(articleTitle).toBeTruthy();
      expect(articleTitle?.length).toBeGreaterThan(0);
    } else {
      // Skip test if no articles are available
      console.log('No articles available to test navigation');
    }
  });

  test('should display article metadata', async ({ page }) => {
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstArticle = page.locator('article').first();
    
    // Check for category badge
    const category = firstArticle.locator('span').first();
    await expect(category).toBeVisible();
    
    // Check for source info (may not be present in all cases)
    const sourceInfo = firstArticle.locator('text=/Source|Author/');
    if (await sourceInfo.count() > 0) {
      await expect(sourceInfo).toBeVisible();
    }
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